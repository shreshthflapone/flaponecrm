import React, { useState, useRef, useEffect, useMemo } from "react";
import "../MyTeam/MyTeam.css";
import InnerHeader from "../../components/InnerHeader.js";
import Card from "../../components/Card.js";
import Tooltip from "../../components/Tooltip.js";
import { FaPencilAlt } from "react-icons/fa";
import { TbFilterShare } from "react-icons/tb";
import MultiSelectDropdown from "../../components/SearchMultiSelectDropdown.js";
import MultiDropdown from "../../components/MultiDropdown.js";
import SearchInput from "../../components/SearchInput.js";
import SidePopup from "../../components/Popup/SidePopup.js";
import "./CourseList.css";
import { giveTextColor } from "../../helpers/textColors.js";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import Dropdown from "../../components/Dropdown.js";
import { RiArrowUpDownFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SmallLoader from "../../components/SmallLoader.js";
import constant from "../../constant/constant.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../store/authSlice.js";
import MultiLevelDropdown from "../../components/MultiLevelDropdown.js";
import { useTitle } from "../../hooks/useTitle.js";
import NoPermission from "../../components/NoPermission.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const CourseList = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const limit = 10;
  useTitle("Course List - Flapone Aviation");

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
  const [totalCount, setTotalCount] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState([]);
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
 
  //kamlesh
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const [dateMoreOptions, setDateMoreOptions] = useState([]);
  const [listStatusOptions,setListStatusOptions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  
  const [listFilter, setListFilter] = useState(
    {
      "page_type": "course",
      "page_type_lable": "Course",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "listStatusOptions":"",
      "filterOnOff":false

    }
  );
//end
  const handleFilterClick = () => {
    setShowFilterPopup(true);
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
      "page_type": "course",
      "page_type_lable": "Course",
      "searchtext": searchBlog,
      "searchByOptions": searchBy,
      "dateMoreOptions": dateMore,
      "categoryOptions": checkedItems,
      "dateRangeValue": `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      "listStatusOptions": selectedStatus,
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
  
    setSearchBlog("");
    setCheckedItems([...categoryData]);
    setSelectedStatus([]);
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
      "page_type": "course",
      "page_type_lable": "Course",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "listStatusOptions":"",
      "searchtext":"",
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
  const openCourseAddPage = () => {
    navigate("/course-detail");
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
  }, [categoryData]);
 /* const updateCoursePosition = (index,value,id) => {
    recordList[index]['position'] = value?value:"";
    setRecordList([...recordList]);
    updateArticlePostion(id,recordList[index]['position']);
  }*/

  const updateCoursePosition = (index,value,id) => {
    /*    
    recordList[index]['position'] = value?value:"";
    setRecordList([...recordList]);
    */
     const updatedSections =  recordList.map((section) => {
      if (section.id === id) {
        return { ...section, ['position']: value };
      }
      return section;
    });
    setRecordList(updatedSections);
    updateArticlePostion(id,value);
  }

  const openDetailPage = (index,id) =>{
    navigate("/course-detail/"+id);
  }
  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
  }
 
  const updateArticlePostion = async (id,value) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/flapone_list.php?fun=positionupdatecourse`,
      headers: { "Auth-Id": user.auth_id },
      data: {"course_id": id,"value":value}
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
          setListStatusOptions([...JSON.parse(response.data.data.filterlist.listStatusOptions)]);
          if(checkedItems.length <= 0){
            setCheckedItems([...JSON.parse(response.data.data.filterlist.categoryData)]);
          }
          setCategoryData([...JSON.parse(response.data.data.filterlist.categoryData)]);
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
             searchByValue:"Chapter",
             checkedTeamItems:"Team",
             categoryOptions:"Location Type",
             selectedCourses:"Course",
             subject:"Subject",
             categoryCheckedItems:"Category"
             
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
        heading="Courses"
        txtSubHeading="View and manage all courses here. Use the options provided to add new courses or edit existing ones."
        showButton={true}
        iconText="Add New Course"
        onClick={openCourseAddPage}
      />
      <Card className="bg5 mt16 pb16">
        <div className="myteam-filters v-center jcsb pl16 brd-b1 pb12 pt12 fww">
          <div className="left-side-filter v-center fww">
            <div className=" mb12 ">
              <Dropdown
                label={dateLabel}
                options={dateMoreOptions}
                selectedValue={dateMore}
                onValueChange={handleDateMoreChange}
              />
            </div>
            <div className="report-date mr4 mb12 ml4">
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
            <div className="category-filter mr8 searching-drop mb12">
                  <MultiLevelDropdown
                    placeholder="Category"
                    data={categoryData}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                  />
            </div>
           
            <div className="status-filter mr8  mb12">
              <MultiDropdown
                label="Status"
                options={listStatusOptions}
                selectedValues={selectedStatus}
                onSelect={handleSelectStatus}
              />
            </div>
            
            <div className="search-by-drp mb12 mr8">
              <Dropdown
                label={searchLabel}
                options={searchByOptions}
                selectedValue={searchBy}
                onValueChange={handleSearchByChange}
              />
            </div>
            <div className="search-filter  mb12 v-center mr16">
              {showSearchInput && (
                <SearchInput
                  onSearchChange={handleSearchChange}
                  clearSignal={clearSignal}
                  placeholder={searchLabel}
                />
              )}
            </div>
            <div
              className="box-center filter-container br4 ls1  mb12"
              onClick={handleFilterClick}
            >
              <TbFilterShare className="cp  fc5 filter-icon mr8" />
              <span className="fs14">Filter</span>
            </div>
            <button className="bg1 fs12 pl12 pr12 pt8 pb8 fc3 cp br16 ls1 mr8 mb12" onClick={()=>applyFilter()}>
              GO
            </button>
            {listFilter && listFilter.filterOnOff && (
              <button
              className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6 mb12"
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
                          listStatusOptions
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
                <th onClick={() => handleSortByChange('title')}  style={{ minWidth: "200px" }}>
                  <p className="box-center">
                    Title
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange('type')}  style={{ minWidth: "200px" }}>
                  <p className="box-center">
                    Type
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
                <th onClick={() => handleSortByChange("article_type")} style={{ minWidth: "120px" }}>
                  <p className="box-center">
                  Category
                    <RiArrowUpDownFill className="cp ml4" />
                  </p>
                </th>
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
                <th style={{ minWidth: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortList.map((blog,index) => (
                <tr key={blog.id}>
                  <td>{blog.id}</td>
                  <td>
                    {blog.course_status === "1" ? (
                      <a
                        href={`${blog.article_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-row lc2 lh18"
                      >
                        {blog.title}
                      </a>
                    ) : (
                      <p className="text-row lc2 lh18">{blog.title}</p>
                    )}
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        blog.type === "0"
                          ? "Blogs"
                          : blog.type === "1"
                            ? "Success Stories"
                            : blog.type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {blog.type=='1'?"Combo":"Individual"}
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        blog.cat_type === "drone"
                          ? "Blogs"
                          : blog.cat_type === "stories"
                            ? "Success Stories"
                            : blog.cat_type === "aircrafts"
                              ? "Awards"
                              : blog.cat_type === "aircrafts"
                                ? "News"
                                : blog.cat_type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {blog.article_type}
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        blog.course_status === "1"
                          ? "Approve"
                          : blog.course_status === "2"
                            ? "Draft"
                            : blog.course_status === "0"
                              ? "Rejected"
                              : blog.course_status
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {blog.status}
                  </td>
                  <td>{blog.create_date}</td>
                  <td>{blog.update_date}</td>
                  <td>
		   {user.role === '1'?
                    <input
                      type="number"
                      id="position"
                      name="position"
                      min={1}
                      max={99}
                      placeholder="Position"
                      value={blog.position}
                      style={{ 
                        backgroundColor: blog.article_status!=="1" ? '#f9f9f9' : '',
                        cursor: blog.article_status!=="1" ? 'not-allowed' : '' 
                      }}
                      onInput={(e) => {
                        if (e.target.value.length > 2) {
                          e.target.value = e.target.value.slice(0, 2); 
                        }
                      }}

                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 2) {
                          updateCoursePosition(index,value,blog.id); 
                        }
                      }}
                      onFocus={(e) => {
                        if (blog.article_status === "1") {
                          e.target.select(); 
                        }
                      }}
                      autoComplete="off"
                      readOnly={blog.article_status!=="1"}
                      className="input-field-number-pos"
                    />:blog.position
		    }	   
                  </td>
                  <td className="box-center" onClick={()=>openDetailPage(index,blog.id)}>
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
                    <MultiLevelDropdown
                      placeholder="Category"
                      data={categoryData}
                      checkedItems={checkedItems}
                      setCheckedItems={setCheckedItems}
                    />
                  </div>
                  <div className="mb20">
                    <p className="fs16 fw6 mb12">Status</p>
                    <MultiDropdown
                      label="Status"
                      options={listStatusOptions}
                      selectedValues={selectedStatus}
                      onSelect={handleSelectStatus}
                    />
                  </div>
                  
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
                  <div className="filter-button-container mt16 pt16 box-center myteam-filters ">
                  <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 fw6 "
                      onClick={closeFilter}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="bg1 fc3 pt8 pb8 pl16 pr16 br24 mr12 fs12 ls1 fw6"
                      onClick={()=>applyFilter()}>
                      Apply
                    </button>
                    <button
                      type="button"
                      className="clear fs12 pl12 pr12 pt8 pb8 fc1 cp br16 ls1 fw6"
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

export default CourseList;
