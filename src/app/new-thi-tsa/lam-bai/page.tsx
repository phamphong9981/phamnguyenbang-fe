import React, {useEffect} from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamResultDto, SubmitExamDto, useExamSet, useSubmitExam } from '@/hooks/useExam';
import { useState } from 'react';


function TSAExam() {
  const searchParams = useSearchParams();
  const [examId, setExamId] = useState<string>('');
  
  useEffect(() => {
    const id = searchParams.get('examId') || '';
    setExamId(id);
    console.log('🚀 Exam ID:', id);
    console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));
  }, [searchParams]);
  return (
    <div>TSAExam</div>
  )
}

export default TSAExam