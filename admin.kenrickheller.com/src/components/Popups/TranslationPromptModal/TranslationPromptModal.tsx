import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFetch } from '../../../api/backend-api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th { background-color: #f2f2f2; }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${props => props.primary ? '#007bff' : '#ccc'};
  color: ${props => props.primary ? 'white' : 'black'};
`;

const isStringValidForTranslation = (key: string, val: any) => {
  if (typeof val !== 'string' || val.trim().length === 0) return false;
  
  const lowerKey = key.toLowerCase();
  const lowerVal = val.toLowerCase();
  
  // Exclude common non-translatable fields by key name
  if (lowerKey.includes('id') && !lowerKey.includes('video')) return false;
  if (lowerKey.includes('code')) return false;
  if (lowerKey.includes('url')) return false;
  if (lowerKey.includes('avatar')) return false;
  if (lowerKey.includes('image')) return false;
  if (lowerKey.includes('file')) return false;
  if (lowerKey.includes('email')) return false;
  if (lowerKey.includes('password')) return false;
  if (lowerKey.includes('token')) return false;
  if (lowerKey.includes('by')) return false; // createdBy, updatedBy
  if (lowerKey.includes('date') || lowerKey.includes('time')) return false; // createdAt, updatedAt
  
  // Exclude common non-translatable fields by value format
  if (lowerVal.startsWith('http://') || lowerVal.startsWith('https://')) return false;
  if (val.match(/^\d{4}-\d{2}-\d{2}/)) return false; // date string
  
  // Exclude short symbols
  if (val.trim().length <= 1) return false;

  return true;
};

const extractStrings = (data: any, path = ''): { key: string; value: string }[] => {
  let strings: { key: string; value: string }[] = [];
  
  if (!data) return strings;
  
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        strings = strings.concat(extractStrings(item, `${path}[${index}]`));
      });
    } else {
      Object.keys(data).forEach(key => {
        if (isStringValidForTranslation(key, data[key])) {
          strings.push({ key: path ? `${path}.${key}` : key, value: data[key] });
        } else if (typeof data[key] === 'object') {
          strings = strings.concat(extractStrings(data[key], path ? `${path}.${key}` : key));
        }
      });
    }
  }
  return strings;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const TranslationPromptModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const fetch = useFetch();
  
  const [candidates, setCandidates] = useState<{ key: string; value: string; selected: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      const strings = extractStrings(data);
      // Remove duplicates by value
      const uniqueValues = new Set();
      const uniqueStrings = strings.filter(s => {
        if (uniqueValues.has(s.value)) return false;
        uniqueValues.add(s.value);
        return true;
      });
      setCandidates(uniqueStrings.map(s => ({ ...s, selected: true })));
    }
  }, [isOpen, data]);

  if (!isOpen || candidates.length === 0) return null;

  const toggleSelection = (index: number) => {
    setCandidates(prev => prev.map((c, i) => i === index ? { ...c, selected: !c.selected } : c));
  };

  const handleTranslate = async () => {
    const textsToTranslate = candidates.filter(c => c.selected).map(c => c.value);
    if (textsToTranslate.length === 0) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      await fetch({
        url: 'pgcore/rest-api/translation/auto-translate',
        method: 'post',
        data: { texts: textsToTranslate }
      });
      alert('Tự động dịch thành công và đã tạo file i18n!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi tự động dịch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>Tự động dịch nội dung mới</ModalHeader>
        <ModalBody>
          <p>Hệ thống phát hiện có nội dung chữ vừa được thêm/sửa. Bạn có muốn tự động dịch sang các ngôn ngữ khác không?</p>
          <Table>
            <thead>
              <tr>
                <th>Trường dữ liệu</th>
                <th>Nội dung</th>
                <th>Dịch</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.key}</td>
                  <td>{c.value.length > 50 ? c.value.substring(0, 50) + '...' : c.value}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={c.selected} 
                      onChange={() => toggleSelection(idx)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} disabled={loading}>Bỏ qua</Button>
          <Button primary onClick={handleTranslate} disabled={loading}>
            {loading ? 'Đang dịch...' : 'Dịch các mục đã chọn'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TranslationPromptModal;
