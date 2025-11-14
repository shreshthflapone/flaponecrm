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
import "./BlogList.css";
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
import { useTitle } from "../../hooks/useTitle.js";

import NoPermission from "../../components/NoPermission.js";
import FilteredDataDisplay from "../../components/FilteredDataDisplay.js";

const BlogList = () => {
  useTitle("Blogs List - Flapone Aviation");

  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessRoleLimit = constant.accessRole;
  const accessContentDeptLimit = constant.accesscontentDept;
  const userRole = user.role;
  const userDept = user.dept_id;
  const pageRoleAccess = accessRoleLimit.includes(userRole);
  const pageContentAccessDept = accessContentDeptLimit.includes(userDept);

  const limit = 10;
  const [blogList, setBlogList] = useState([]);
  const [searchBlog, setSearchBlog] = useState("");
  const [clearSignal, setClearSignal] = useState(false);
  const [dateLabel, setDateLabel] = useState("Select Date");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState([]);
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
  const [totalCount, setTotalCount] = useState(0);

  const [pageNum, setPageNum] = useState(1);
  const [autoLoader, setAutoLoader] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchByOptions, setSearchByOptions] = useState([]);
  const [dateMoreOptions, setDateMoreOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [listStatusOptions,setListStatusOptions] = useState([]);
  const [blogListFilter, setBlogListFilter] = useState(
    {
      "page_type": "blog",
      "page_type_lable": "Blog",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "selectedAuthor":"",
      "listStatusOptions":"",
      "filterOnOff":false

    }
  );
//end
  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };

  const handleSelectCategory = (value) => {
    const index = selectedCategory.indexOf(value);
    if (index === -1) {
      setSelectedCategory([...selectedCategory, value]);
    } else {
      const updatedValues = [...selectedCategory];
      updatedValues.splice(index, 1);
      setSelectedCategory(updatedValues);
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
    let sortedList = [...blogList];

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
  }, [blogList, sortBy, sortDirection]);

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
      ...blogListFilter,
      "page_type": "blog",
      "page_type_lable": "Blog",
      "searchtext": searchBlog,
      "searchByOptions": searchBy,
      "dateMoreOptions": dateMore,
      "categoryOptions": selectedCategory,
      "dateRangeValue": `${format(dateRangeValue[0].startDate, "dd-MM-yyyy")} | ${format(dateRangeValue[0].endDate, "dd-MM-yyyy")}`,
      "listStatusOptions": selectedStatus,
      "selectedAuthor":selectedAuthor,
      "filterOnOff":true,
    };
    setBlogListFilter(updatefilter);
    setPageNum(1);
    closeFilter();
    setFilterApplyStatus(true);
    
  };

  useEffect(()=>{
     getBlogList();
  },[blogListFilter])
  
  const clearFilter = () => {
    setFilterApplyStatus(false);
  
    setSearchBlog("");
    setSelectedCategory([]);
    setSelectedStatus([]);
    setSelectedAuthor([]);
    setClearSignal(true);
    setDateMore("");
    setShowDateInput(false);
    setPageNum(1);
    setSearchBy("");
    setSearchLabel("Search By");
    setShowSearchInput(false);
    setTimeout(() => setClearSignal(false), 0);
    let updateFilter =  {
      ...blogListFilter,
      "page_type": "blog",
      "page_type_lable": "Blog",
      "searchtext": "",
      "searchByOptions":"",
      "dateMoreOptions":"",
      "categoryOptions":"",
      "selectedAuthor":"",
      "listStatusOptions":"",
      "searchtext":"",
      "filterOnOff":false
    }
    setBlogListFilter(updateFilter);
    closeFilter();
  };

  const handleAuthorChange = (selectedOptions) => {
    setSelectedAuthor(selectedOptions);
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
  const openBlogAddPage = () => {
    navigate("/blog-detail");
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
            getBlogList();
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
    blogList[index]['position'] = value?value:"";
    setBlogList([...blogList]);
    updateArticlePostion(id,blogList[index]['position']);
  }
  */
 const updateBlogPosition = (index,value,id) => {
    /*    
    recordList[index]['position'] = value?value:"";
    setRecordList([...recordList]);
    */
     const updatedSections = blogList.map((section) => {
      if (section.id === id) {
       
        return { ...section, ['position']: value };
      }
      return section;
    });
    setBlogList(updatedSections);
    updateArticlePostion(id,value);
  }

  const openDetailPage = (index,id) =>{
    navigate("/blog-detail/"+id);
  }
  const checkUserLogin = (response) =>{
    if(response.data.login.status===0){
      dispatch(logout());
      navigate("/login");
    }
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
  const updateArticlePostion = async (id,value) => {
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/blog_detail.php?fun=positionupdatearticle`,
      headers: { "Auth-Id": user.auth_id },
      data: {"blog_id": id,"value":value}
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === 1) {
        setAuthorList(JSON.parse(response.data.data.list))
      }
    }).catch(function (error) {
      console.error('Error during login:', error);
    });
  }

  	

  const getBlogList = async () => {
    setAutoLoader(true);
    setDisplayMsg("");
    axios({
      method: 'post',
      url: `${constant.base_url}/admin/flapone_list.php?fun=getlistrecord`,
      headers: { "Auth-Id": user.auth_id },
      data: {"page_num":pageNum,"limit":limit,"filter":blogListFilter}
    }).then(function (response) {
      checkUserLogin(response);
      if (response.data.data.status === "1") {
        if (pageNum === 1) {
          setTotalPageNum(response.data.data.total_page);
          setTotalCount(response.data.data.total_count);
          setBlogList([...response.data.data.list]);
          setSearchByOptions([...JSON.parse(response.data.data.filterlist.searchByOptions)]);
          setDateMoreOptions([...JSON.parse(response.data.data.filterlist.dateMoreOptions)]);
          setCategoryOptions([...JSON.parse(response.data.data.filterlist.categoryOptions)]);
          setListStatusOptions([...JSON.parse(response.data.data.filterlist.listStatusOptions)]);
        }
        else {
          setBlogList([...blogList, ...response.data.data.list]);
        }
        setPageNum((prevPageNum) => prevPageNum + 1);
      }
      else {
        setTotalCount(0);
        setBlogList([]);
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
             categoryOptions:"Category",
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
        heading="Manage Content"
        txtSubHeading="Here, you can view, add, and edit your blog posts, awards, news and success stories. "
        showButton={true}
        iconText="Add New Content"
        onClick={openBlogAddPage}
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
              <MultiDropdown
                label="Category"
                options={categoryOptions}
                selectedValues={selectedCategory}
                onSelect={handleSelectCategory}
              />
            </div>
            <div className="status-filter mr8 mt8 mb12">
              <MultiDropdown
                label="Status"
                options={listStatusOptions}
                selectedValues={selectedStatus}
                onSelect={handleSelectStatus}
              />
            </div>
            <div className="mr8 authors-filter mt8 mb12">
              <MultiSelectDropdown
                options={autherList}
                placeholder={"Search Authors"}
                onSelectionChange={handleAuthorChange}
                clearSignal={clearSignal}
              />
            </div>
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
            {blogListFilter && blogListFilter.filterOnOff && (
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
                                filterData={blogListFilter}
                                labels={filterLabels}
                                onClearAll={clearFilter}
                                onFilterCountChange={handleFilterCountChange}
                                listOptions={{
                                  listStatusOptions, 
                                  searchByOptions,
                                  categoryOptions
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
                    {blog.article_status === "1" ? (
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
                        blog.article_type === "blog"
                          ? "Blogs"
                          : blog.article_type === "stories"
                            ? "Success Stories"
                            : blog.article_type === "awards"
                              ? "Awards"
                              : blog.article_type === "news"
                                ? "News"
                                : blog.article_type
                      ),
                      textTransform: "capitalize",
                    }}
                  >
                    {blog.article_type === "stories"? "Success Stories": blog.article_type}
                  </td>
                  <td
                    style={{
                      color: giveTextColor(
                        blog.article_status === "1"
                          ? "Approve"
                          : blog.article_status === "2"
                            ? "Draft"
                            : blog.article_status === "0"
                              ? "Rejected"
                              : blog.article_status
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
                      max={99999}
                      placeholder="Position"
                      value={blog.position}
                      style={{ 
                        backgroundColor: blog.article_status !== "1" ? '#f9f9f9' : '',
                        cursor: blog.article_status !== "1" ? 'not-allowed' : '' 
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 5) {
                          updateBlogPosition(index, value, blog.id); 
                        }
                      }}
                      onInput={(e) => {
                        if (e.target.value.length > 5) {
                          e.target.value = e.target.value.slice(0, 5); 
                        }
                      }}
                      onFocus={(e) => {
                        if (blog.article_status === "1") {
                          e.target.select(); 
                        }
                      }}
                      autoComplete="off"
                      readOnly={blog.article_status !== "1"}
                      className="input-field-number-pos"
                    />:blog.position}

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
                  <p className="fs16 fw6 mb12">Category</p>
                  <MultiDropdown
                    label="Category"
                    options={categoryOptions}
                    selectedValues={selectedCategory}
                    onSelect={handleSelectCategory}
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
                <div className="mb20 authors">
                  <p className="fs16 fw6 mb12">Authors</p>
                  <MultiSelectDropdown
                    options={autherList}
                    placeholder={"Select Authors"}
                    onSelectionChange={handleAuthorChange}
                  />{" "}
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

export default BlogList;
