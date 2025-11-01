'use client';

import React from 'react'
import Wait from '../new-man-hinh-cho/Wait'
import Confirm from '../new-xac-nhan-thong-tin-du-thi/Confirm'
import { TSAProvider, useTSAContext } from './hooks/TSAProvider';
function TSAExamMain(){
  const {stateConfirm} = useTSAContext();
  return(
    <div>
      {stateConfirm.isChoosing && <Wait />}
      {stateConfirm.isConfirmed !== 'none' && <Confirm />}
    </div>
  );
}
function TSAExam() {
  return (
    <TSAProvider>
      <TSAExamMain />
    </TSAProvider>
  );
}

export default TSAExam