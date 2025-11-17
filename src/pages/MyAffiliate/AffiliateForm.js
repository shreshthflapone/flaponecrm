import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import InnerHeader from "../../components/InnerHeader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import CommonImageUpload from "../../components/commonImageUpload";
import DocUpload from "../../components/DocUpload";
import SingleDropdown from "../../components/SingleDropdown";
import "./MyAffiliate.css";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryCodeOptions from "../../data/CountryCodes.js";
import {
  FaAngleDown,
} from "react-icons/fa";


const AffiliateForm = ({ view, affiliateid }) => {
    const { id }    = useParams();
    const user      = useSelector((state) => state.auth);
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    const [profileImg, setProfileImg] = useState("");
    const [comment, setComment] = useState("");
    const [viewStatus, setViewStatus] = useState("");
    const [formid, setFormId] = useState("");
    const dropdownRef = useRef(null);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const [otherInfoName, setOtherInfoName] = useState("");
    const [otherInfoDesignation, setOtherInfoDesignation] = useState("");
    const [otherInfoEmail, setOtherInfoEmail] = useState("");
    const [otherInfoMobile, setOtherInfoMobile] = useState("");
    const [countryCode, setCountryCode] = useState("91");
    const [countryCodeAlt, setCountryCodeAlt] = useState("91");
    const [countryCodeDropdown, setCountryCodeDropdown] = useState(false);
    const [countryCodeAltDropdown, setCountryCodeAltDropdown] = useState(false);

    const [categoryCommissionCategory, setCategoryCommissionCategory] = useState("");
    const [categoryCommissionSubCategory, setCategoryCommissionSubCategory] = useState("");
    const [categoryCommissionType, setCategoryCommissionType] = useState({
        label: "Fixed",
        value: "fixed"
    });
    const [categoryCommissionValue, setCategoryCommissionValue] = useState("");

    const [affiliateFormData, setAffiliateFormData] = useState({
        id: id ? id : "",
        full_name: "",
        email: "",
        mobile_number: "",
        alternate_mobile_number: "",
        gender:{},
        affiliateType:{},
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        other_info: [],
        customBusinessType: "",
        pan_card_number: "",
        aadhar_number: "",
        business_name: "",
        businessType:{},
        accountType:{},
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        gst_number: "",
        rmSelectedOption:{},
        categoryCommission:[],
        status:"",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAffiliateFormData((prevValues) => ({
        ...prevValues,
            [name]: value,
        }));
    };
    const handleUploadProfileImg = (file) => {
        setProfileImg(file);
    };
    const genderOptions = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" }
    ];
    const affiliateTypeOptions = [
        { label: "Individual", value: "individual" },
        { label: "Influencer", value: "influencer" },
        { label: "Agency", value: "agency" },
        { label: "Company", value: "company" }
    ];
    const businessTypesOptions = [
        { label: "Business Type 1", value: "business_type_1" },
        { label: "Business Type 2", value: "business_type_2" },
        { label: "Business Type 3", value: "business_type_2" },
        { label: "Other", value: "other" }
    ];
    const accountTypesOptions = [
        { label: "Saving Account", value: "saving" },
        { label: "Current Account", value: "current" },
        { label: "Salary Account", value: "salary" },
        { label: "Joint Account", value: "joint" },
    ];
    const categoryOptions = [
        { label: "All", value: "all" },
        { label: "Drone", value: "2" },
        { label: "Aircrafts", value: "1" },
    ];
    const subcategoryOptions = [
        { label: "Drone Pilot Training", value: "3" },
        { label: "Drone Product", value: "6" },
        { label: "Drone Services", value: "7" },
    ];
    const commissionTypeOptions = [
        { label: "Fixed", value: "fixed" },
        { label: "Percentage", value: "percentage" },
    ];
    const rmListOptions = [
        { label: "Shivam Kumar", value: "1" },
        { label: "Nand Kumar", value: "2" },
    ];
    //commissionTypeOptions
    const handleSelectGender = (option) => {
        setAffiliateFormData((prevValues) => ({
        ...prevValues,
            gender: option,
        }));
    };
    const handleCountryCodeSelect = (selectedCountry) => {
        setCountryCode(selectedCountry);

        if (selectedCountry.length === 0) {
            toast.warn("Please select country code!");
            return false;
        }
        setCountryCodeDropdown(false);
    };
    const handleCountryCodeAltSelect = (selectedCountry) => {
        setCountryCodeAlt(selectedCountry);

        if (selectedCountry.length === 0) {
            toast.warn("Please select country code!");
            return false;
        }
        setCountryCodeAltDropdown(false);
    };
    const handleSelectAffiliateType = (option) => {
        setAffiliateFormData((prevValues) => ({
        ...prevValues,
            affiliateType: option,
        }));
    };
    const handleSelectBusinessType = (option) => {
        setAffiliateFormData((prev) => ({
            ...prev,
            businessType: option,
            customBusinessType: option.value !== "other" ? "" : prev.customBusinessType
        }));
    };
    const handleSelectAccountType = (option) => {
        setAffiliateFormData((prev) => ({
            ...prev,
            accountType: option,
        }));
    };
    const handleSelectCategory = (option) => {
        setCategoryCommissionCategory(option);
    };
    const handleSelectSubCategory = (option) => {
        setCategoryCommissionSubCategory(option);
    };
    const handleSelectCommissionType = (option) => {
        console.log("Option:", option);
        setCategoryCommissionType(option);
    };

    const handleCommissionValueChange = (e) => {
        setCategoryCommissionValue(e.target.value);
    };
    const handleSelectRMList = (option) => {
        setAffiliateFormData((prevValues) => ({
        ...prevValues,
            rmSelectedOption: option,
        }));
    };
    const handleStatusChange = (e) => {
        setAffiliateFormData((prevValues) => ({
        ...prevValues,
            status: e.target.value,
        }));
    };
    const handleDeleteOtherInfo = (id) => {
        setAffiliateFormData((prev) => ({
            ...prev,
            other_info: prev.other_info.filter((item) => item.id !== id),
        }));
    };

    const openAffiliateListPage = (e) => {
        navigate("/my-affiliate");
    };

    const openPdf = () => {
        window.open(constant.terms_pdf_url+"affilites_onborading_terms.pdf.pdf", "_blank");
    };

    const handleAddOtherInfo = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9][0-9]{9}$/;

        if (!otherInfoName || !otherInfoDesignation || !otherInfoEmail || !otherInfoMobile) {
            toast.warn("Please fill all Other Info fields.");
            return;
        }

        if (!emailRegex.test(otherInfoEmail)) {
            toast.warn("Please enter a valid email address.");
            return;
        }

        if (!mobileRegex.test(otherInfoMobile)) {
            toast.warn("Mobile number must be 10 digits and start with 9, 8, 7, or 6.");
            return;
        }

        const newContact = {
            id: affiliateFormData.other_info.length + 1,
            name: otherInfoName,
            designation: otherInfoDesignation,
            email: otherInfoEmail,
            mobile: otherInfoMobile
        };

        setAffiliateFormData((prev) => ({
            ...prev,
            other_info: [...prev.other_info, newContact],
        }));

        setOtherInfoName("");
        setOtherInfoDesignation("");
        setOtherInfoEmail("");
        setOtherInfoMobile("");
    };
    
    const handleAddCategoryCommission = () => {

        if (!categoryCommissionCategory?.value) {
            toast.warn("Please select Category");
            return;
        }

        if (categoryCommissionSubCategory?.value === "2" && !categoryCommissionSubCategory?.value) {
            toast.warn("Please select Sub Category");
            return;
        }

        if (!categoryCommissionType?.value) {
            toast.warn("Please select Commission Type");
            return;
        }

        if (!categoryCommissionValue || categoryCommissionValue <= 0) {
            toast.warn("Please enter valid Commission Value");
            return;
        }

        const newCommission = {
            id: affiliateFormData.categoryCommission.length + 1,
            category: categoryCommissionCategory,
            subcategory: categoryCommissionCategory?.value === "2" ? categoryCommissionSubCategory : null,
            commissionType: categoryCommissionType?.value,
            commissionValue: categoryCommissionValue,
        };

        setAffiliateFormData((prev) => ({
            ...prev,
            categoryCommission: [...prev.categoryCommission, newCommission],
        }));

        setCategoryCommissionCategory("");
        setCategoryCommissionSubCategory("");
        setCategoryCommissionType("");
        setCategoryCommissionValue("");
    };


    const handleDeleteCategoryCommission = (id) => {
        setAffiliateFormData((prev) => ({...prev, categoryCommission: prev.categoryCommission.filter((item) => item.id !== id)}));
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateMobile = (mobile) => {
        const regex = /^[6-9][0-9]{9}$/;
        return regex.test(mobile);
    };

    const validatePAN = (pan) => {
        const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return regex.test(pan);
    };

    const validateAadhaar = (aadhaar) => {
        const regex = /^[0-9]{12}$/;
        return regex.test(aadhaar);
    };

    const validateGST = (gst) => {
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        return regex.test(gst);
    };

    const handleSubmit = () => {
        if (!affiliateFormData.full_name.trim()) {
            toast.warn("Please enter full name");
            return;
        }
        if (!affiliateFormData.email.trim()) {
            toast.warn("Please enter email");
            return;
        }
        if (!validateEmail(affiliateFormData.email)) {
            toast.warn("Please enter a valid email");
            return;
        }

        if (!affiliateFormData.mobile_number.trim()) {
            toast.warn("Please enter mobile number");
            return;
        }
        if (!validateMobile(affiliateFormData.mobile_number)) {
            toast.warn("Mobile number must be 10 digits & start with 6,7,8,9");
            return;
        }

        if (!affiliateFormData.gender?.value) {
            toast.warn("Please select gender");
            return;
        }

        if (!affiliateFormData.affiliateType?.value) {
            toast.warn("Please select affiliate type");
            return;
        }

        if (!affiliateFormData.address_line_1.trim()) {
            toast.warn("Please enter Address Line 1");
            return;
        }

        if (!affiliateFormData.city.trim()) {
            toast.warn("Please enter city");
            return;
        }

        if (!affiliateFormData.state.trim()) {
            toast.warn("Please enter state");
            return;
        }

        if (!affiliateFormData.country.trim()) {
            toast.warn("Please enter country");
            return;
        }

        if (!affiliateFormData.pincode.trim()) {
            toast.warn("Please enter pincode");
            return;
        }
        
        if (!affiliateFormData.pan_card_number?.trim()) {
            toast.warn("Please enter PAN card number");
            return;
        }
        if (!validatePAN(affiliateFormData.pan_card_number)) {
            toast.warn("Please enter a valid PAN number");
            return;
        }
        
        if (!affiliateFormData.aadhar_number?.trim()) {
            toast.warn("Please enter Aadhaar number");
            return;
        }
        if (!validateAadhaar(affiliateFormData.aadhar_number)) {
            toast.warn("Aadhaar must be 12 digits");
            return;
        }

        if (!affiliateFormData.gst_number?.trim()) {
            toast.warn("Please enter GST number");
            return;
        }

        if (!validateGST(affiliateFormData.gst_number)) {
            toast.warn("Please enter valid GST number");
            return;
        }

        if (!affiliateFormData.business_name?.trim()) {
            toast.warn("Please enter business name");
            return;
        }

        if (!affiliateFormData.businessType?.value) {
            toast.warn("Please select Business Type");
            return;
        }

        if (affiliateFormData.businessType.value === "other" && !affiliateFormData.customBusinessType.trim()) {
            toast.warn("Please enter your custom business type");
            return;
        }

        if (!affiliateFormData.account_holder_name?.trim()) {
            toast.warn("Please enter account holder name");
            return;
        }

        if (!affiliateFormData.bank_name.trim()) {
            toast.warn("Please enter bank name");
            return;
        }

        if (!affiliateFormData.account_number.trim()) {
            toast.warn("Please enter account number");
            return;
        } else if (!/^\d+$/.test(affiliateFormData.account_number.trim())) {
            toast.warn("Account number must contain digits only");
            return;
        }

        if (!affiliateFormData.ifsc_code.trim()) {
            toast.warn("Please enter IFSC Code");
            return;
        }

        if (!affiliateFormData.accountType?.value) {
            toast.warn("Please select account type");
            return;
        }

        if (affiliateFormData.categoryCommission.length === 0) {
            toast.warn("Please add at least one category commission");
            return;
        }

        if (!affiliateFormData.rmSelectedOption?.value) {
            toast.warn("Please select Relationship Manager (RM)");
            return;
        }

        if (!affiliateFormData.acceptTerms) {
            toast.warn("Please accept Terms & Conditions");
            return;
        }

        if (!affiliateFormData.status) {
            toast.warn("Please select status (Approve, Draft, or Reject)");
            return;
        }

        console.log("Form Submitted Successfully");
        console.log(affiliateFormData);
    };


    
    useEffect(()=>{
        setViewStatus(view);
        setFormId(affiliateid);
    },[affiliateid,view]);

    return (
        <>
            <div className="batch-main-grp-inputs mb16 v-center jcsb fww  bg8 pl20 pr20 pt20 pb20">
                <div className="address-head mb24 w100">
                    <p className="fs18 fc14 ls1 lh22">Profile Information</p>
                    <p class="fs14 fc5 ls1 lh18 mt4">Provide basic personal information for affiliate identification.</p>
                </div>
                <div className="w100 upload-image v-center mb12">
                    <p className="flx33 fc15 fw6 fs14 mb12 ls1">Upload Photo</p>
                    <div className="image-upload-compoenent affiliate-image">
                        {/*<CommonImageUpload
                            setWorkImage={setProfileImg}
                            imgData={profileImg}
                            uploadImg={handleUploadProfileImg}
                            delstatus={false}
                        />*/}
                        <DocUpload 
                            onImageUpload={handleUploadProfileImg}
                            imgData={profileImg}
                            imgstatus={ profileImg ? true : false}
                            disabled={viewStatus !== undefined}
                            imagedoctrel={true}
                        />
                    </div>
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <p className="fc15 fw6 fs14 ls1">Full Name<span className="fc4">*</span></p>
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        autoComplete="off"
                        value={affiliateFormData.full_name}
                        onChange={handleInputChange}
                        readOnly={viewStatus !== undefined}
                        style={{
                            backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                            cursor: viewStatus !== undefined ? "not-allowed" : "",
                        }}
                    />
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <p className="fc15 fw6 fs14 ls1">Email<span className="fc4">*</span></p>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        autoComplete="off"
                        value={affiliateFormData.email}
                        onChange={handleInputChange}
                        readOnly={viewStatus !== undefined}
                        style={{
                            backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                            cursor: viewStatus !== undefined ? "not-allowed" : "",
                        }}
                    />
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <p className="fc15 fw6 fs14 ls1">Mobile Number<span className="fc4">*</span></p>
                    <div className="input-group df pr w100 fww aisc">
                        <div className="input-group-prepend df">
                            <div className="role-dropdown" ref={dropdownRef}>
                            <div
                                className="selected-role fs14 h40 country-code"
                                onClick={() =>
                                setCountryCodeDropdown(!countryCodeDropdown)
                                }
                            >
                                {countryCode || "Country Code"}
                                <FaAngleDown className="fc16 fs14" />
                            </div>
                            {countryCodeDropdown && (
                                <ul className="role-options fs14">
                                {countryCodeOptions.map((option) => (
                                    <li
                                    key={option}
                                    onClick={() => handleCountryCodeSelect(option)}
                                    >
                                    {option}
                                    </li>
                                ))}
                                </ul>
                            )}
                            </div>
                        </div>
                        <input
                            className="form-control br4"
                            type="text"
                            name="mobile_number"
                            placeholder="Mobile Number"
                            autoComplete="off"
                            value={affiliateFormData.mobile_number}
                            onChange={handleInputChange}
                            readOnly={viewStatus !== undefined}
                            style={{
                                backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                cursor: viewStatus !== undefined ? "not-allowed" : "",
                            }}
                        />
                    </div>
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <p className="fc15 fw6 fs14 ls1">Alternate Mobile Number</p>

                    <div className="input-group df pr w100 fww aisc">
                        <div className="input-group-prepend df">
                            <div className="role-dropdown" ref={dropdownRef1}>
                            <div
                                className="selected-role fs14 h40 country-code"
                                onClick={() =>
                                setCountryCodeAltDropdown(!countryCodeAltDropdown)
                                }
                            >
                                {countryCodeAlt || "Country Code"}
                                <FaAngleDown className="fc16 fs14" />
                            </div>
                            {countryCodeAltDropdown && (
                                <ul className="role-options fs14">
                                {countryCodeOptions.map((option) => (
                                    <li
                                    key={option}
                                    onClick={() => handleCountryCodeAltSelect(option)}
                                    >
                                    {option}
                                    </li>
                                ))}
                                </ul>
                            )}
                            </div>
                        </div>
                        <input
                            className="form-control br4"
                            type="text"
                            name="alternate_mobile_number"
                            placeholder="Alternate Mobile Number"
                            autoComplete="off"
                            value={affiliateFormData.alternate_mobile_number}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <SingleDropdown
                        label="Gender"
                        options={genderOptions}
                        selectedOption={affiliateFormData.gender}
                        onSelect={handleSelectGender}
                        placeholder="Select Gender"
                        compulsory={<span className="fc4">*</span>}
                    />
                </div>
                <div className="form-group-settings cm-fr flx48">
                    <SingleDropdown
                        label="Affiliate Type"
                        options={affiliateTypeOptions}
                        selectedOption={affiliateFormData.affiliateType}
                        onSelect={handleSelectAffiliateType}
                        placeholder="Select Affiliate Type"
                        compulsory={<span className="fc4">*</span>}
                    />
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Address Details</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Enter the affiliate’s residential or business address details.</p>
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <input
                            type="text"
                            name="address_line_1"
                            placeholder="Address Line 1"
                            autoComplete="off"
                            value={affiliateFormData.address_line_1}
                            onChange={handleInputChange}
                            readOnly={viewStatus !== undefined}
                            style={{
                                backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                cursor: viewStatus !== undefined ? "not-allowed" : "",
                            }}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <input
                            type="text"
                            name="address_line_2"
                            placeholder="Address Line 2"
                            autoComplete="off"
                            value={affiliateFormData.address_line_2}
                            onChange={handleInputChange}
                            readOnly={viewStatus !== undefined}
                            style={{
                                backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                cursor: viewStatus !== undefined ? "not-allowed" : "",
                            }}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <div className="v-center jcsb fww w100">
                            <div className="form-group-settings cm-fr flx48">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    autoComplete="off"
                                    value={affiliateFormData.city}
                                    onChange={handleInputChange}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }}
                                />
                            </div>
                            <div className="form-group-settings cm-fr flx48">
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    autoComplete="off"
                                    value={affiliateFormData.state}
                                    onChange={handleInputChange}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <div className="v-center jcsb fww w100">
                            <div className="form-group-settings cm-fr flx48">
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    autoComplete="off"
                                    value={affiliateFormData.country}
                                    onChange={handleInputChange}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }}
                                />
                            </div>
                            <div className="form-group-settings cm-fr flx48">
                                <input
                                    type="number"
                                    name="pincode"
                                    placeholder="Pincode"
                                    autoComplete="off"
                                    value={affiliateFormData.pincode}
                                    onChange={handleInputChange}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Additional Contacts</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Add additional contact numbers and communication references.</p>
                    </div>
                    <div className="form-group-settings cm-fr flx1 mr8">
                        <input type="text" placeholder="Name"
                        value={otherInfoName}
                        onChange={(e) => setOtherInfoName(e.target.value)}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }} />
                    </div>

                    <div className="form-group-settings cm-fr flx1 mr8">
                        <input type="text" placeholder="Designation"
                        value={otherInfoDesignation}
                        onChange={(e) => setOtherInfoDesignation(e.target.value)}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }} />
                    </div>

                    <div className="form-group-settings cm-fr flx1 mr8">
                        <input type="text" placeholder="Email"
                        value={otherInfoEmail}
                        onChange={(e) => setOtherInfoEmail(e.target.value)}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }} />
                    </div>

                    <div className="form-group-settings cm-fr flx1">
                        <input type="text" placeholder="Mobile Number"
                        value={otherInfoMobile}
                        onChange={(e) => setOtherInfoMobile(e.target.value)}
                                    readOnly={viewStatus !== undefined}
                                    style={{
                                        backgroundColor: viewStatus !== undefined ? "#f9f9f9" : "",
                                        cursor: viewStatus !== undefined ? "not-allowed" : "",
                                    }} />
                    </div>
                    {viewStatus === undefined && (
                        <div className="df jce w100 mb12">
                            <button className="h36 pt8 pb8 pl16 pr16 cp bg1 fc3 br4 mb16"
                            onClick={handleAddOtherInfo}>Add</button>
                        </div>
                    )}
                    {affiliateFormData.other_info.map((other_info, index) => (
                        <>
                            <div className="w100 pt12 pb12 brd-t1">
                                <div className="w100" key={other_info.id} >
                                    <div className="df jcsb">
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`highlight_text_${other_info.id}`}
                                                name={`highlight_text_${other_info.id}`}
                                                placeholder="Enter Text"
                                                value={other_info.name}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`highlight_value_${other_info.id}`}
                                                name={`highlight_value_${other_info.id}`}
                                                placeholder="Value"
                                                value={other_info.designation}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`highlight_text_${other_info.id}`}
                                                name={`highlight_text_${other_info.id}`}
                                                placeholder="Enter Text"
                                                value={other_info.email}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`highlight_value_${other_info.id}`}
                                                name={`highlight_value_${other_info.id}`}
                                                placeholder="Value"
                                                value={other_info.mobile}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="fc4 cp flx1 box-center fs24 mt8 mb16 jce"
                                        onClick={() =>
                                            handleDeleteOtherInfo(
                                                other_info.id
                                            )
                                        }
                                    >
                                        <MdDelete />
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Identity Verification (KYC)</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Upload and verify identity documents required for KYC compliance.</p>
                    </div>
                    <div className="w100 df jcsb">
                        <div className="form-group-settings cm-fr flx48">
                            <p className="fc15 fw6 fs14 ls1">Pan Number</p>
                            <input
                                type="text"
                                name="pan_card_number"
                                placeholder="Pan Card Number"
                                autoComplete="off"
                                value={affiliateFormData.pan_card_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx48 upload-image mb24">
                            <p className="w100 fc15 fw6 fs14 mb12 ls1">Upload Pan Card</p>
                            <div className="w100 image-upload-compoenent affiliate-image">
                                <DocUpload 
                                    onImageUpload={handleUploadProfileImg}
                                    imgData={profileImg}
                                    imgstatus={ profileImg ? true : false}
                                    disabled={viewStatus !== undefined}
                                    imagedoctrel={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w100 brd-dashed-t1 df jcsb">
                        <div className="form-group-settings cm-fr flx48 mt24">
                            <p className="fc15 fw6 fs14 ls1">Aaddhar Number</p>
                            <input
                                type="text"
                                name="aadhar_number"
                                placeholder="Aadhar Number"
                                autoComplete="off"
                                value={affiliateFormData.aadhar_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx48 upload-image mb24 mt24">
                            <p className="flx33 fc15 fw6 fs14 mb12 ls1">Upload Aadhar Card</p>
                            <div className="image-upload-compoenent affiliate-image">
                                <DocUpload 
                                    onImageUpload={handleUploadProfileImg}
                                    imgData={profileImg}
                                    imgstatus={ profileImg ? true : false}
                                    disabled={viewStatus !== undefined}
                                    imagedoctrel={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w100 brd-dashed-t1 df jcsb">
                        <div className="form-group-settings cm-fr flx48 mt24">
                            <p className="fc15 fw6 fs14 ls1">GST Number</p>
                            <input
                                type="text"
                                name="gst_number"
                                placeholder="GST Number"
                                autoComplete="off"
                                value={affiliateFormData.gst_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flx48 upload-image mb24 mt24">
                            <p className="flx33 fc15 fw6 fs14 mb12 ls1">Upload GST</p>
                            <div className="image-upload-compoenent affiliate-image">
                                <DocUpload 
                                    onImageUpload={handleUploadProfileImg}
                                    imgData={profileImg}
                                    imgstatus={ profileImg ? true : false}
                                    disabled={viewStatus !== undefined}
                                    imagedoctrel={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w100 brd-dashed-t1 df jcsb">
                        <div className="form-group-settings cm-fr flx48 mt24">
                            <p className="fc15 fw6 fs14 ls1">Business Name</p>
                            <input
                                type="text"
                                name="business_name"
                                placeholder="Business Name"
                                autoComplete="off"
                                value={affiliateFormData.business_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-settings cm-fr flx48 mt24">
                            <SingleDropdown
                                label="Business Type"
                                options={businessTypesOptions}
                                selectedOption={affiliateFormData.businessType}
                                onSelect={handleSelectBusinessType}
                                placeholder="Select Business Type"
                                compulsory={""}
                            />
                        </div>
                        {affiliateFormData.businessType?.value === "other" && (
                            <div className="form-group-settings cm-fr flx48">
                                <p className="fc15 fw6 fs14 ls1">Business Type<span className="fc4">*</span></p>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your business type"
                                    value={affiliateFormData.customBusinessType}
                                    onChange={(e) =>
                                        setAffiliateFormData((prev) => ({
                                            ...prev,
                                            customBusinessType: e.target.value
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Bank Information</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Enter bank account information to enable payouts and settlements.</p>
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <p className="fc15 fw6 fs14 ls1">Account Holder Name<span className="fc4">*</span></p>
                        <input
                            type="text"
                            name="account_holder_name"
                            placeholder="Account Holder Name"
                            autoComplete="off"
                            value={affiliateFormData.account_holder_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <p className="fc15 fw6 fs14 ls1">Bank Name<span className="fc4">*</span></p>
                        <input
                            type="text"
                            name="bank_name"
                            placeholder="Bank Name"
                            autoComplete="off"
                            value={affiliateFormData.bank_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <p className="fc15 fw6 fs14 ls1">Account Number<span className="fc4">*</span></p>
                        <input
                            type="text"
                            name="account_number"
                            placeholder="Account Number"
                            autoComplete="off"
                            value={affiliateFormData.account_number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <p className="fc15 fw6 fs14 ls1">IFSC Code<span className="fc4">*</span></p>
                        <input
                            type="text"
                            name="ifsc_code"
                            placeholder="IFSC Code"
                            autoComplete="off"
                            value={affiliateFormData.ifsc_code}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <SingleDropdown
                            label="Account Type"
                            options={accountTypesOptions}
                            selectedOption={affiliateFormData.accountType}
                            onSelect={handleSelectAccountType}
                            placeholder="Select Account Type"
                            compulsory={<span className="fc4">*</span>}
                        />
                    </div>
                    <div className="flx48 upload-image mb24">
                        <p className="fc15 fw6 fs14 mb12 ls1">Upload Cancelled Cheque</p>
                        <div className="image-upload-compoenent affiliate-image">
                            <DocUpload 
                                onImageUpload={handleUploadProfileImg}
                                imgData={profileImg}
                                imgstatus={ profileImg ? true : false}
                                disabled={viewStatus !== undefined}
                                imagedoctrel={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Commission Structure</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Set commission structure based on assigned categories.</p>
                    </div>
                    <div className="form-group-settings cm-fr flx48">
                        <SingleDropdown
                            label="Category"
                            options={categoryOptions}
                            selectedOption={categoryCommissionCategory}
                            onSelect={handleSelectCategory}
                            placeholder="Select Category"
                            compulsory={<span className="fc4">*</span>}
                        />
                    </div>
                    {categoryCommissionCategory.value === "2" && (
                        <div className="form-group-settings cm-fr flx48">
                            <SingleDropdown
                                label="SubCategory"
                                options={subcategoryOptions}
                                selectedOption={categoryCommissionSubCategory}
                                onSelect={handleSelectSubCategory}
                                placeholder="Select Sub Category"
                                compulsory={<span className="fc4">*</span>}
                            />
                        </div>
                    )}
                    <div className="form-group-settings cm-fr flx48">
                        <p className="fc15 fw6 fs14 ls1">
                            Commission Type And Value <span className="fc4">*</span>
                        </p>

                        <div className="input-group df pr w100 fww aisc">
                            <div className="input-group-prepend df">
                                <div className="role-dropdown" ref={dropdownRef2}>
                                    <div
                                        className="selected-role fs14 h40 country-code"
                                        onClick={() => setCountryCodeDropdown(!countryCodeDropdown)}
                                    >
                                        {categoryCommissionType?.label || "Select Type"}
                                        <FaAngleDown className="fc16 fs14" />
                                    </div>

                                    {countryCodeDropdown && (
                                        <ul className="role-options fs14">
                                            {commissionTypeOptions.map((option) => (
                                                <li
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleSelectCommissionType(option);
                                                        setCountryCodeDropdown(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <input
                                className="form-control br4"
                                type="number"
                                name="commission_value"
                                placeholder={
                                    categoryCommissionType?.value === "fixed"
                                        ? "Enter Amount"
                                        : "Enter Percentage"
                                }
                                autoComplete="off"
                                value={categoryCommissionValue}
                                onChange={handleCommissionValueChange}
                                style={{ paddingRight: "35px" }}
                            />
                            {categoryCommissionType?.value && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        bottom: "11px",
                                        fontWeight: "600",
                                        color: "#555",
                                    }}
                                >
                                    {categoryCommissionType.value === "fixed" ? "₹" : "%"}
                                </span>
                            )}
                        </div>
                    </div>
                    {viewStatus === undefined && (
                        <div className="df jce w100 mb12">
                            <button className="h36 pt8 pb8 pl16 pr16 cp bg1 fc3 br4 mb16"
                            onClick={handleAddCategoryCommission}>Add</button>
                        </div>
                    )}
                    {affiliateFormData.categoryCommission.map((category_commission, index) => (
                        <>
                            <div className="w100 mt16 mb24">
                                <div className="w100" key={category_commission.id} >
                                    <div className="df jcsb">
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`category_commission_text_${category_commission.id}`}
                                                name={`category_commission_text_${category_commission.id}`}
                                                placeholder="Enter Text"
                                                value={category_commission.category?.label}
                                                autoComplete="off"
                                            />
                                        </div>
                                        {category_commission.category?.value === "2" && (
                                            <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                                <input
                                                    type="text"
                                                    id={`category_commission_text_${category_commission.id}`}
                                                    name={`category_commission_text_${category_commission.id}`}
                                                    placeholder="Value"
                                                    value={category_commission.subcategory?.label}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        )}
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`category_commission_text_${category_commission.id}`}
                                                name={`category_commission_text_${category_commission.id}`}
                                                placeholder="Enter Text"
                                                value={category_commission.commissionType}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="form-group-settings cm-fr flx1 mb0 mr8">
                                            <input
                                                type="text"
                                                id={`category_commission_value_${category_commission.id}`}
                                                name={`category_commission_value_${category_commission.id}`}
                                                placeholder="Value"
                                                value={category_commission.commissionValue}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="fc4 cp flx1 box-center fs24 mt8 mb16 jce"
                                        onClick={() =>
                                            handleDeleteCategoryCommission(
                                                category_commission.id
                                            )
                                        }
                                    >
                                        <MdDelete />
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <div className="v-center brd-t2 pt24 jcsb fww w100">
                    <div className="address-head mb24 w100">
                        <p className="fs18 fc14 ls1 lh22">Agreements & Compliance Documents</p>
                        <p class="fs14 fc5 ls1 lh18 mt4">Review and upload necessary terms & conditions or agreement documents.</p>
                    </div>
                    <div className="w100 upload-image mb24">
                        <p className="fc15 fw6 fs14 mb12 ls1">Upload T&C Signed Copy/Agreement/Email soft copy</p>
                        <div className="image-upload-compoenent affiliate-image">
                            <DocUpload 
                                onImageUpload={handleUploadProfileImg}
                                imgData={profileImg}
                                imgstatus={ profileImg ? true : false}
                                disabled={viewStatus !== undefined}
                                imagedoctrel={true}
                            />
                        </div>
                    </div>
                    <div className="w100 form-group-settings cm-fr affiliates-grp mb0">
                        <p className="fc15 fw6 fs14 mb8 ls1">Comment</p>
                        <textarea
                            className="comments p12 br4"
                            placeholder="Any Comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                        />
                    </div>
                </div>
                <div className="v-center brd-t2 pt24 mt24 jcsb fww w100">
                    <div className="form-group-settings cm-fr flx48">
                        <SingleDropdown
                            label="RM List"
                            options={rmListOptions}
                            selectedOption={affiliateFormData.rmSelectedOption}
                            onSelect={handleSelectRMList}
                            placeholder="Select RM"
                            compulsory={<span className="fc4">*</span>}
                        />
                    </div>
                </div>
                <div className="terms-wrapper">
                    <div className="term-item">
                        <input type="checkbox" id="t1" required className="term-checkbox" />
                        <label htmlFor="t1" className="term-label" onClick={openPdf}>
                        I confirm that the information provided is accurate and entered with full responsibility, without any intent of misuse or unauthorized benefit. </label>
                    </div>
                </div>
            </div>
            <div className="radio-grp-status box-center fww mt12 mb12">
                <label htmlFor="approve" className="cp v-center mr16 fc13">
                    <input type="radio" className="mr8 cp" id="approve" value="1" checked={affiliateFormData.status === "1"} onChange={handleStatusChange} />Approve
                </label>
                <label htmlFor="draft" className="cp v-center mr16 fc6 ml24">
                    <input type="radio" className="mr8 cp" id="draft" value="2" checked={affiliateFormData.status === "2"} onChange={handleStatusChange} />Draft
                </label>
                <label htmlFor="reject" className="cp v-center mr16 fc9 ml24">
                    <input type="radio" className="mr8 cp" id="reject" value="3" checked={affiliateFormData.status === "0"} onChange={handleStatusChange} />Reject
                </label>
            </div>
            {viewStatus === undefined && (
                <div className="add-more box-center mt24">
                    <button
                        type="button"
                        className="btn-blue bg1 br24 fs14 cp pl24 pr24 pt10 pb10 ml24 ls2"
                        onClick={handleSubmit}
                    >Submit</button>
                </div>
            )}
            <ToastContainer position="bottom-right" />
        </>
    );
};

export default AffiliateForm;
