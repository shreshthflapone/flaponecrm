import React, { useState, useRef, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader";
import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { FaPencilAlt } from "react-icons/fa";
import { TbFilterShare } from "react-icons/tb";
import MultiSelectDropdown from "../../components/SearchMultiSelectDropdown";
import MultiDropdown from "../../components/MultiDropdown";
import SearchInput from "../../components/SearchInput";
import SidePopup from "../../components/Popup/SidePopup";
import "./FaqList.css";
import { giveTextColor } from "../../helpers/textColors";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import Dropdown from "../../components/Dropdown";
import { RiArrowUpDownFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import { useTitle } from "../../hooks/useTitle.js";
import NoPermission from "../../components/NoPermission.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const FaqList = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 10;
  useTitle("Faq List - Flapone Aviation");

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);


  const [recordList, setRecordList] = useState([]);
  const [searchBlog, setSearchBlog] = useState("");
  const [clearSignal, setClearSignal] = useState(false);
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  //const [selectedAuthor, setSelectedAuthor] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateMore, setDateMore] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchLabel, setSearchLabel] = useState("Search By");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dateRangePickerRef = useRef(null);
  const [autherList, setAuthorList] = useState([]);
  //kamlesh
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const [dateMoreOptions, setDateMoreOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [listStatusOptions,setListStatusOptions] = useState([]);
  const [byselectOptions,setBySelectOptins] = useState([]);
  const [selectbyType,setSelectbyType] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [listFilter, setListFilter] = useState(
    {
      "page_type": "faq",
      "page_type_lable": "Faq",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "selectedAuthor":"",
      "selectbyType":"",
      "checkedItems":"",
      "listStatusOptions":"",
      "filterOnOff":false
    }
  );
  const [totalCount, setTotalCount] = useState(0);

//end
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };

  const handleSelectCategory = (value) => {
    setSelectedCategory(value);
    setSelectbyType([]);
    setCheckedItems([...categoryData]);
    if(value.value!=='commom'){
        bySelectApi(value);
    }
  };
  const [sortBy, setSortBy] = useState(""); 
  const [sortDirection, setSortDirection] = useState("asc"); 
  const handleSortByChange = (field) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortList = useMemo(() => {
    let sortedList = [...recordList];

    sortedList.sort((a, b) => {
      // Handle null or undefined values for sortBy field
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      // Use localeCompare for string comparison, numeric for id
      if (sortBy === 'id') {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }else if (sortBy==='position'){
        return sortDirection === "asc" ? a.position - b.position : b.position - a.position;
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });

    return sortedList;
  }, [recordList, sortBy, sortDirection]);

  const handleSelectStatus = (value) => {
    const index = selectedStatus.indexOf(value);
    if (index === -1) {
      setSelectedStatus([...selectedStatus, value]);
    } else {
      const updatedValues = [...selectedStatus];
      updatedValues.splice(index, 1);
      setSelectedStatus(updatedValues);
    }
  };

  const handleSearchChange = (value) => {
    setSearchBlog(value);
  };
  const applyFilter = async () => {
    let updatefilter = {
      ...listFilter,
      "page_type": "faq",
      "page_type_lable": "Faq",
      "searchtext": searchBlog,
      "searchByOptions": searchBy,
      "dateMoreOptions": dateMore,
      "categoryOptions": selectedCategory,
      "dateRangeValue": `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      "listStatusOptions": selectedStatus,
      "selectedAuthor":"",
      "selectbyType":selectbyType,
      "checkedItems":checkedItems,
      "filterOnOff":true,

    };
    setListFilter(updatefilter);
    setPageNum(1);
    closeFilter();
    setFilterApplyStatus(true);
    
  };

  useEffect(()=>{
     getListRecord();
  },[listFilter])
  
  const clearFilter = () => {
    setFilterApplyStatus(false);
    setSearchBlog("");
    setSelectedCategory("");
    setCheckedItems([...categoryData]);
    setSelectbyType([]);
    setSelectedStatus([]);
    //setSelectedAuthor([]);
    setClearSignal(true);
    setDateMore("");
    setShowDateInput(false);
    setPageNum(1);
    setSearchBy("");
    setSearchLabel("Search By");
    setShowSearchInput(false);
    setTimeout(() => setClearSignal(false), 0);
    let updateFilter =  {
      ...listFilter,
      "page_type": "faq",
      "page_type_lable": "Faq",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "selectedAuthor":"",
      "selectbyType":"",
      "checkedItems":"",
      "listStatusOptions":"",
      "filterOnOff":false,

    }
    setListFilter(updateFilter);
    closeFilter();
  };


  const closeFilter = () => {
    setShowFilterPopup(false);
    document.body.style.overflow = "auto";
  };

  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const handleDateRangeChange = (item) => {
    setDateRangeValue([item.selection]);
    // setShowDateRangePicker(false);
    setShowDateInput(true);
  };

  const handleClickOutside = (event) => {
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setShowDateRangePicker(false);
    }
  };

  useEffect(() => {
    if (showDateRangePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRangePicker]);



  const handleDateMoreChange = (option) => {
    setDateMore(option.value);
    if(option.value!=''){
      setShowDateInput(true);
    }
    else{
      setShowDateInput(false);
    }
    setDateLabel(option.label);
    if (option.value) {
      setShowDateRangePicker(true);
    } else {
      setShowDateRangePicker(false);
    }
  };
  const handleSearchByChange = (option) => {
    setSearchBy(option.value);
    setSearchLabel(option.label);
    if (option.value) {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
  };
  const openFaqAddPage = () => {
    navigate("/faq-detail");
  };

  //kamlesh custom code
  useEffect(() => {
    const scrollHandler = () => {
      // Debouncing logic starts here
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 70 && !isFetching) {
          setIsFetching(true);
          if (pageNum <= totalPageNum) {
            getListRecord();
          }
        }
      }, 200); // Adjust the debounce delay as needed
    };

    let scrollTimeout;

    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, [isFetching,pageNum]);

  useEffect(() => {
    getautherlist();
  }, []);
  /*const updateBlogPosition = (index,value,id) => {
    recordList[index]['position'] = value?value:1;
    setRecordList([...recordList]);
    updatePostion(id,recordList[index]['position']);
  }
  */
 const updateBlogPosition = (index,value,id) => {
    /*    
    recordList[index]['position'] = value?value:"";
    setRecordList([...recordList]);
    */
     const updatedSections = recordList.map((section) => {
      if (section.id === id) {
        return { ...section, ['position']: value };
      }
      return section;
    });
    setRecordList(updatedSections);
    updatePostion(id,value);
  }	
  const openDetailPage = (index,id) =>{
    navigate("/faq-detail/"+id);
  }
  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
  }
  const handleSelectByType = (value) => {
    const index = selectbyType.indexOf(value);
    if (index === -1) {
      setSelectbyType([...selectbyType, value]);
    } else {
      const updatedValues = [...selectbyType];
      updatedValues.splice(index, 1);
      setSelectbyType(updatedValues);
    }
  }
  const bySelectApi = async (value) =>{
    axios({
        method: 'post',
        url: `${constant.base_url}/admin/flapone_list.php?fun=getlistbyselect`,
        headers: { "Auth-Id": user.auth_id },
        data: value,
      }).then(function (response) {
        checkUserLogin(response);
        if (response.data.data.status === "1") {
            if(value.value==='category'){
                if(checkedItems.length <= 0){
                    setCheckedItems([...JSON.parse(response.data.data.list)]);
                }
              setCategoryData([...JSON.parse(response.data.data.list)]);
            }
            else{
                setBySelectOptins([...JSON.parse(response.data.data.list)])
            }
        }
      }).catch(function (error) {
        console.error('Error during login:', error);
      });  
  }
  const getautherlist = async () => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/blog_detail.php?fun=getautherlist`,
      headers: { "Auth-Id": user.auth_id },
      data: { }
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
        setAuthorList(JSON.parse(response.data.data.list))
      }
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }
  const updatePostion = async (id,value) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/flapone_list.php?fun=positionupdatefaq`,
      headers: { "Auth-Id": user.auth_id },
      data: {"faq_id": id,"value":value}
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
      }
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }
  const getListRecord = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/flapone_list.php?fun=getlistrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: {"page_num":pageNum,"limit":limit,"filter":listFilter}
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        if (pageNum === 1) {
          setTotalPageNum(response.data.data.total_page);
          setTotalCount(response.data.data.total_count);

          setRecordList([...response.data.data.list]);
          setSearchByOptions([...JSON.parse(response.data.data.filterlist.searchByOptions)]);
          setDateMoreOptions([...JSON.parse(response.data.data.filterlist.dateMoreOptions)]);
          setCategoryOptions([...JSON.parse(response.data.data.filterlist.categoryOptions)]);
          setListStatusOptions([...JSON.parse(response.data.data.filterlist.listStatusOptions)]);
        }
        else {
          setRecordList([...recordList, ...response.data.data.list]);
        }
        setPageNum((prevPageNum) => prevPageNum + 1);
      }
      else {
        setTotalCount(0);
        setRecordList([]);
        setDisplayMsg(response.data.data.msg);

      }
      setAutoLoader(false);
      setIsFetching(false);
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }
  const filterLabels = {
         page_type: "Page Type",
         datetypefilter: "Date Type",
         dateMoreOptions: "Date Type",
         instructorselect:"Faculty",
         dateRangeValue: "Date Range",
         listStatusOptions:"Status",
         searchByOptions:"Search By",
         searchtext:"Search Value",
         checkedTeamItems:"Team",
         categoryOptions:"Type",
         courseoption:"Course",
         starrating:"Rating"
         
       };
       const [filterCount, setFilterCount] = useState(0);
      
        const [filterApplyStatus, setFilterApplyStatus] = useState(false);
      
        const handleFilterCountChange = (count) => {
          setFilterCount(count);
        };
 
  return (
    <>
      {(pageRoleAccess || pageContentAccessDept) && ( <>
      <InnerHeader
        heading="FAQs"
        txtSubHeading="View and manage all frequently asked questions (FAQs) here."
        showButton={true}
        iconText="Add New FAQ"
        onClick={openFaqAddPage}
      />
      <Card className="bg5 mt16 pb16">
        <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww">
          <div className="left-side-filter v-center fww">
            <div className="mt8 mb12 ">
              <Dropdown
                label={dateLabel}
                options={dateMoreOptions}
                selectedValue={dateMore}
                onValueChange={handleDateMoreChange}
              />
            </div>
            <div className="report-date mr4 mb12 mt8 ml4">
              {showDateInput && dateRangeValue && (
                <div
                  className="date-range-input"
                  onClick={toggleDateRangePicker}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "#7b7b7b",
                    fontSize: "14px",
                  }}
                >
                  {`${format(
                    dateRangeValue[0].startDate,
                    "dd/MM/yyyy"
                  )} - ${format(dateRangeValue[0].endDate, "dd/MM/yyyy")}`}
                </div>
              )}
              {showDateRangePicker && (
                <div ref={dateRangePickerRef}>
                  <DateRangePicker
                    onChange={handleDateRangeChange}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={dateRangeValue}
                    direction="horizontal"
                  />
                </div>
              )}
            </div>
            
            <div className="category-filter mr8 mt8 mb12">
               <Dropdown
                label="Select Type"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onValueChange={handleSelectCategory}
              />
            </div>
            {selectedCategory && selectedCategory.value==='course' && <div className="category-filter-opt mr8 mt8 mb12">
                <MultiDropdown
                label="Course"
                options={byselectOptions}
                selectedValues={selectbyType}
                onSelect={handleSelectByType}
              />
            </div>}
            {selectedCategory && selectedCategory.value === 'category' && <div className="category-filter-opt mr8 mt8 mb12">
               <MultiLevelDropdown
                    placeholder="Select Category"
                    data={categoryData}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                />
            </div>}
            

            <div className="status-filter mr8 mt8 mb12">
              <MultiDropdown
                label="Status"
                options={listStatusOptions}
                selectedValues={selectedStatus}
                onSelect={handleSelectStatus}
              />
            </div>
            {/* <div className="mr8 authors-filter mt8 mb12">
              <MultiSelectDropdown
                options={autherList}
                placeholder={"Search Authors"}
                onSelectionChange={handleAuthorChange}
                clearSignal={clearSignal}
              />
            </div> */}
            <div className="search-by-drp mt8 mb12 mr8">
              <Dropdown
                label={searchLabel}
                options={searchByOptions}
                selectedValue={searchBy}
                onValueChange={handleSearchByChange}
              />
            </div>
            <div className="search-filter mt8 mb12 v-center mr16">
              {showSearchInput && (
                <SearchInput
                  onSearchChange={handleSearchChange}
                  clearSignal={clearSignal}
                  placeholder={searchLabel}
                />
              )}
            </div>
            <div
              className="box-center filter-container br4 ls1 mt8 mb12"
              onClick={handleFilterClick}
            >
              <TbFilterShare className="cp  fc5 filter-icon mr8" />
              <span className="fs14">Filter</span>
            </div>
            <button className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8" onClick={()=>applyFilter()}>
              GO
            </button>
            {listFilter && listFilter.filterOnOff && (
              <button
              className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
              onClick={clearFilter}
            >
              Clear
            </button>
            )}

          </div>
        </div>
        {filterApplyStatus && (
                      <FilteredDataDisplay
                        filterData={listFilter}
                        labels={filterLabels}
                        onClearAll={clearFilter}
                        onFilterCountChange={handleFilterCountChange}
                        listOptions={{
                          listStatusOptions, 
                          searchByOptions,
                        }}
                      />
                    )}
        <div className="pl16 pt16 fww fs12 ">{"Total Results: "+totalCount}</div>
        <div
          className="blog-listing table-container df w100 fdc mt16"
          style={{ overflow: "auto" }}
        >
          <table className="wsnw list-blog">
            <thead className="w100">
              <tr>
              <th onClick={() => handleSortByChange("id")}>
                  <p className="box-center">
                    Id
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('question_answer_text')}  style={{ minWidth: "200px" }}>
                  <p className="box-center">
                    Question
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('faq_type')}  style={{ minWidth: "150px" }}>
                  <p className="box-center">
                    Type
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
	  {/*<th onClick={() => handleSortByChange("course_name")} style={{ minWidth: "60px" }}>
                  <p className="box-center">
                  Course
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("category_type")} style={{ minWidth: "60px" }}>
                  <p className="box-center">
                  Category
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
	    */}
                <th onClick={() => handleSortByChange('status')} style={{ minWidth: "100px" }}>
                  <p className="box-center">
                    Status
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('create_date')} style={{ minWidth: "100px" }}>
                  <p className="box-center">
                    Created Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('update_date')} style={{ minWidth: "100px" }}>
                  <p className="box-center">
                    Updated Date
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('position')}>
                  <p className="box-center">
                    Position
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th style={{ minWidth: "50px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortList.map((list,index) => (
                <tr key={list.id}>
                  <td>{list.id}</td>
                  <td className="box-center minw100">
                    <p className="text-row lc2 lh18">{list.question_answer_text}</p>
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        list.faq_type === "Category"
                          ? "Blogs"
                          : list.faq_type === "stories"
                            ? "Success Stories"
                            : list.faq_type === "awards"
                              ? "Awards"
                              : list.faq_type === "drone"
                                ? "News"
                                : list.faq_type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {list.faq_type}
                  </td>
		 {/*
                  <td className="box-center">
                    <p className="text-row lc2 lh18">{list.course_name}</p>
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        list.category_type === "Aircrafts"
                          ? "Blogs"
                          : list.category_type === "stories"
                            ? "Success Stories"
                            : list.category_type === "awards"
                              ? "Awards"
                              : list.category_type === "Drone"
                                ? "News"
                                : list.category_type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {list.category_type}
                  </td>
		  */}
                  <td
                    style={{
                      color: giveTextColor(
                        list.list_status === "1"
                          ? "Approve"
                          : list.list_status === "2"
                            ? "Draft"
                            : list.list_status === "0"
                              ? "Rejected"
                              : list.list_status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {list.status}
                  </td>
                  <td>{list.create_date}</td>
                  <td>{list.update_date}</td>
                  <td>
		   {user.role === '1'?
                    <input
                      type="number"
                      id="position"
                      name="position"
                      min={1}
                      max={555}
                      placeholder="Position"
                      value={list.position}
                      style={{ 
                        backgroundColor: list.list_status!=="1" ? '#f9f9f9' : '',
                        cursor: list.list_status!=="1" ? 'not-allowed' : '' 
                      }}
                      onChange={(e) => updateBlogPosition(index,e.target.value,list.id)}
                      autoComplete="off"
                      readOnly={list.list_status!=="1"}
                      className="input-field-number-pos"
                    />:list.position}

                  </td>
                  <td onClick={()=>openDetailPage(index,list.id)}>
                    <div className="action-icons box-center">
                      <Tooltip title="Edit">
                        <FaPencilAlt
                          title="Edit"
                          className="icon edit-icon ml12 cp fs18 fc5"
                          style={{ verticalAlign: "middle", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayMsg && 
                  <div className="box-center mt12">
                    {displayMsg}
                  </div>
          }
          {autoLoader && (
                  <div className="box-center mb12">
                    <SmallLoader className={"mb12"} />
                  </div>
                )}
        </div>
        {showFilterPopup && (
          <SidePopup show={showFilterPopup} onClose={closeFilter}>
            <div className="">
              <div className="df jcsb brd-b1 p12 box-center bg7 w100 fc1 ls2 lh22">
                <p className="fs18 fc1 ">Filters</p>
                <button onClick={closeFilter} className="lead-close-button">
                  X
                </button>
              </div>
              <div className="filter-lists pl16 pt16 pr8">
                <div className="mb20">
                  <p className="fs16 fw6 mb12">Category Type</p>
                   <Dropdown
                    label="Select By"
                    options={categoryOptions}
                    selectedValue={selectedCategory}
                    onValueChange={handleSelectCategory}
                    />
                </div>
                {selectedCategory && selectedCategory.value==='course' && <div className="mb20">
                    <MultiDropdown
                    label="option"
                    options={byselectOptions}
                    selectedValues={selectbyType}
                    onSelect={handleSelectByType}
                  />
                </div>}
                {selectedCategory && selectedCategory.value === 'category' && <div className="mb20">
               <MultiLevelDropdown
                    placeholder="Select Category"
                    data={categoryData}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                />
            </div>}
                <div className="mb20">
                  <p className="fs16 fw6 mb12">Status</p>
                  <MultiDropdown
                    label="Status"
                    options={listStatusOptions}
                    selectedValues={selectedStatus}
                    onSelect={handleSelectStatus}
                  />
                </div>
                {/* <div className="mb20 authors">
                  <p className="fs16 fw6 mb12">Authors</p>
                  <MultiSelectDropdown
                    options={autherList}
                    placeholder={"Select Authors"}
                    onSelectionChange={handleAuthorChange}
                  />{" "}
                </div> */}
                <div className="pop-search-filter mt8 mb12 df w100 fdc">
                  <div className="mb20">
                    <Dropdown
                      label={searchLabel}
                      options={searchByOptions}
                      selectedValue={searchBy}
                      onValueChange={handleSearchByChange}
                    />
                  </div>
                  {showSearchInput && (
                    <>
                      <p className="fs16 fw6 mb12 df ais">Search </p>
                      <SearchInput
                        onSearchChange={handleSearchChange}
                        clearSignal={clearSignal}
                        placeholder={searchLabel}
                      />
                    </>
                  )}
                </div>
                <div className="filter-button-container mt16 pt16 box-center">
                  <button
                    type="button"
                    className="bg1 fc3 pt10 pb10 pl16 pr16 br24"
                    onClick={()=>applyFilter()}>
                    Apply
                  </button>
                  <button
                    type="button"
                    className="ml24 pt10 pb10 pl16 pr16 br24"
                    onClick={clearFilter}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </SidePopup>
        )}
        </Card>
        </>
      )}
     {!pageRoleAccess && !pageContentAccessDept  && (
            <NoPermission displayMsg={"No permission to access this page"} />
      )}
    </>
  );
};

export default FaqList;
