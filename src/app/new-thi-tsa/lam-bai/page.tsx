'use client';

import React from 'react'
import Wait from '../new-man-hinh-cho/Wait'
import Confirm from '../new-xac-nhan-thong-tin-du-thi/Confirm'
import { TSAProvider, useTSAContext } from './hooks/TSAProvider';
import { useBlockDevTools } from './hooks/useBlockDevTools';
import { useFullscreenState } from './hooks/useForceFullScreen';
import FullscreenModal from './components/modal';
import MathPage from '../lam-bai-toan/page';
import ReadPage from '../lam-bai-doc/page';
import SciencePage from '../lam-bai-khoa-hoc/page';
function TSAExamMain(){
  const {stateConfirm} = useTSAContext();
  {/*const {isFullscreen, setIsFullscreen} = useFullscreenState(false);
  // Chặn DevTools theo cấu hình của bạn
  useBlockDevTools({
    // redirectUrl: 'https://www.google.com/',
    // intervalMs: 600,
    // threshold: 160,
    // captureShortcuts: true,
  });*/}


  return(
    <div>
      {stateConfirm.isChoosing && stateConfirm.isConfirmed === 'none' && <Wait />}
      {stateConfirm.isConfirmed !== 'none'&& stateConfirm.isChoosing === true && <Confirm />}
      {stateConfirm.isConfirmed === 'Tư duy Toán học' && stateConfirm.isChoosing === false && <MathPage/>}
      {stateConfirm.isConfirmed === 'Tư duy Đọc hiểu' && stateConfirm.isChoosing === false && <ReadPage/>}
      {stateConfirm.isConfirmed === 'Tư duy Khoa học & Giải quyết vấn đề' && stateConfirm.isChoosing === false && <SciencePage/>}
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