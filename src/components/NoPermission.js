import React from 'react';
import "./NoPermission.css";
import NoPermissionImg from "../assets/perm.png";

const NoPermission = ({displayMsg}) => {
  return (
    <div className='no-permission fdc'>
        <img src={NoPermissionImg} alt="No Permission"/>
        <p className='mt24 fs16 ls1 lh16 fc4'>{displayMsg}</p>
    </div>
  )
}

export default NoPermission
