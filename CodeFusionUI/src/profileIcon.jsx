import React, { useCallback, useEffect, useRef, useState } from 'react';
import bgImage from './images/user-2517433_640.webp'
const ProfileIcon=()=>{
    return(
    <div className="dashboardProfileIcon" style={{backgroundImage:`url(${bgImage})`}}></div>
    );
}
export default ProfileIcon;