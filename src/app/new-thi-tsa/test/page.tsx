//Folder nay chi de test, co the xoa di neu khong dung den

'use client';

import React from 'react';
import MathRenderer from '@/components/MathRenderer';
import { sampleExamFromHust } from '../lam-bai/mockData'; // chỉnh đường dẫn nếu cần

export default function SimpleExamViewer() {
  const exam = sampleExamFromHust;

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif', fontSize: 16 }}>
      <h1 style={{ marginBottom: 4 }}>{exam.title}</h1>
      <div style={{ color: '#555', marginBottom: 16 }}>
        Năm: {exam.year} — Thời gian: {exam.durationMinutes} phút
      </div>

      {exam.questions.map((q, idx) => (
        <section key={q.id ?? idx} style={{ marginBottom: 28 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Câu {idx + 1}.</strong>{' '}
            <span style={{ color: '#333' }}>({q.section ?? '---'})</span>
          </div>

          {/* Nội dung câu hỏi */}
          <div style={{ marginBottom: 8 }}>
            <MathRenderer content={q.content ?? ''} />
          </div>

          {/* Ảnh (nếu có) */}
          {q.image && (
            <div style={{ marginBottom: 8 }}>
              <img
                src={q.image}
                alt={`Hình minh họa câu ${idx + 1}`}
                style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', border: '1px solid #eee' }}
              />
            </div>
          )}

          {/* Các lựa chọn (nếu có) */}
          {q.options && (
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 8 }}>
              {Object.entries(q.options).map(([key, val]) => (
                <li key={key} style={{ marginBottom: 6 }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type={q.questionType === 'mul_correct' ? 'checkbox' : 'radio'}
                      name={`q_${q.id}`}
                      disabled
                    />
                    <strong style={{ width: 22 }}>{key}.</strong>
                    <div style={{ display: 'inline-block' }}>
                      <MathRenderer content={val} />
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* Nhóm câu (group_question) */}
          {q.subQuestions && (
            <div style={{ marginBottom: 8 }}>
              {q.subQuestions.map((s) => (
                <div key={s.id} style={{ marginBottom: 6 }}>
                  <div>
                    <strong>{s.id}.</strong>{' '}
                    <MathRenderer content={s.content} />
                  </div>
                  <div style={{ color: 'green', marginTop: 4 }}>
                    Đáp án: {String(s.correctAnswer)}
                  </div>
                  {s.explanation && (
                    <div style={{ marginTop: 4 }}>
                      <MathRenderer content={`<b>Giải thích:</b> ${s.explanation}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drag targets (hiển thị dạng chỗ trống + items) */}
          {q.drag && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ marginBottom: 6, fontStyle: 'italic' }}>Câu kéo-thả (preview):</div>

              {q.drag.targets.map((t, ti) => (
                <div key={ti} style={{ marginBottom: 6 }}>
                  {t.map((part, pi) =>
                    part === '_' ? (
                      <span key={pi} style={{ display: 'inline-block', minWidth: 60, borderBottom: '1px solid #333', margin: '0 6px' }} />
                    ) : (
                      <span key={pi}>
                        <MathRenderer content={String(part)} />
                      </span>
                    )
                  )}
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Items:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {q.drag.items.map((it, i) => (
                    <div key={i} style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6 }}>
                      <MathRenderer content={it} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Câu short_answer hiển thị ô nhập (disabled) */}
          {q.questionType === 'short_answer' && (
            <div style={{ marginBottom: 8 }}>
              <input type="text" placeholder="Nhập câu trả lời..." disabled style={{ padding: '6px 8px', width: 240 }} />
            </div>
          )}

          {/* Hiển thị đáp án và giải thích (để bạn kiểm tra) */}
          {q.correctAnswer !== undefined && (
            <div style={{ marginTop: 6, color: 'green' }}>
              <strong>Đáp án (mẫu):</strong> {String(q.correctAnswer)}
            </div>
          )}
          {q.explanation && (
            <div style={{ marginTop: 6 }}>
              <MathRenderer content={`<b>Giải thích:</b> ${q.explanation}`} />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
