import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

// 基本的な質問設定
const baseFormConfig = [
  {
    id: 'page1',
    image: '/images/yochiensei.png',
    question: 'あなたは何年生ですか?',
    type: 'select',
    label: '学年',
    options: ['小学1年生', '小学2年生', '小学3年生', '小学4年生', '小学5年生', '小学6年生','中学1年生','中学2年生','中学3年生','高校1年生','高校2年生','高校3年生' ]
  },
  {
    id: 'page2',
    image: '/images/anonymousTeacher.png',
    question: 'アドバイスをもらう先生',
    type: 'select',
    label: '先生',
    options: ['🦏サイ先生','🐿️リス先生',"🦁ライオン先生"]
  },
  {
    id: 'page3',
    image: '/images/SentenceType.png',
    question: '作文のタイプ',
    type: 'select',
    label: 'タイプ',
    options: ['読書感想文', 'テーマのある作文']
  }
];

// 読書感想文用の追加質問
const bookReviewConfig = [
  {
    id: 'bookType',
    image: '/images/bookType.png',
    question: '本の種類を選んでね',
    type: 'select',
    label: '本の種類',
    options: [
      'ゆかいな内容の本',
      '有名な人物の伝記の本',
      'じっさいにあった話',
      'ぼうけんをする本',
      'かなしいことが起こる本',
      'こわい話についての本',
      'こまりごとに立ち向かう本',
      '食べ物の作り方の本',
      '科学について書かれた本',
      '地球や環境について書かれた本',
      '歴史について書かれた本',
      'ワクワクする本',
      '自分に似た人物が登場する本',
      'ずかん',
      'クイズの本',
      '想像上の人物の日常が書かれたb本',
      '不思議な世界に行く話'
    ]
  },
  {
    id: 'arasuji',
    image: '/images/bookContents.png',
    question: 'その本にはどんなことが\nかかれていたかな',
    type: 'textarea',
    placeholder: 'あらすじ'
  },
  {
    id: 'kokoro',
    image: '/images/bookType.png',
    question: '心にのこった部分は何かな',
    type: 'textarea',
    placeholder: '印象に残ったところ'
  },
  {
    id: 'hyoushi',
    image: '/images/bookType.png',
    question: '本の表紙または\n読む前に題名から考えたこと\nについて書いてね',
    type: 'textarea',
    placeholder: '表紙の様子/本の題名から考えたこと'
  },
  {
    id: 'other',
    image: '/images/bookType.png',
    question: '上のほかに書きたいことを記入してね',
    type: 'textarea',
    placeholder: '書きたいこと'
  }
];

// テーマのある作文用の追加質問
const compositionConfig = [
  {
    id: 'theme',
    image: '/images/danrakuQtheme.png',
    question: 'テーマを記入してね',
    type: 'textarea',
    placeholder: 'テーマ'
  },
  {
    id: 'want1',
    image: '/images/danraku1.png',
    question: 'つたえたいことの1つめを教えてね',
    type: 'textarea',
    placeholder: '１つめにかきたいこと'
  },
  {
    id: 'want2',
    image: '/images/danraku2.png',
    question: 'つたえたいことの２つめを教えてね',
    type: 'textarea',
    placeholder: '２つめにかきたいこと'
  },
  {
    id: 'want3',
    image: '/images/danraku3.png',
    question: 'つたえたいことの３つめを教えてね',
    type: 'textarea',
    placeholder: '３つめにかきたいこと'
  },
  {
    id: 'want4',
    image: '/images/danraku4.png',
    question: 'つたえたいことの４つめを教えてね\n（なかったらとばしてもいいよ）',
    type: 'textarea',
    placeholder: '４つめにかきたいこと',
    optional: true
  }
];

// ステップインジケーターコンポーネント
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <Box style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: '32px',
      padding: '0 20px'
    }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: index === currentStep ? '36px' : '28px',
              height: index === currentStep ? '36px' : '28px',
              borderRadius: '50%',
              backgroundColor: index <= currentStep ? '#000' : '#e0e0e0',
              color: index <= currentStep ? '#fff' : '#999',
              fontWeight: '600',
              fontSize: index === currentStep ? '14px' : '12px',
              transition: 'all 0.3s ease',
              border: index === currentStep ? '3px solid #666' : 'none',
              paddingLeft: '2px',
              paddingBottom: '1px'
            }}
          >
            {index + 1}
          </Box>
          {index < totalSteps - 1 && (
            <Box
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: index < currentStep ? '#000' : '#e0e0e0',
                margin: '0 6px',
                transition: 'all 0.3s ease',
                maxWidth: '80px'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default function DanrakuCard({ onSubmit }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [formConfig, setFormConfig] = useState(baseFormConfig);

  // page3の選択が変更されたときにformConfigを更新
  useEffect(() => {
    const selectedType = formData['page3'];
    if (selectedType) {
      let additionalConfig = [];
      
      if (selectedType === '読書感想文') {
        additionalConfig = bookReviewConfig;
      } else if (selectedType === 'テーマのある作文') {
        additionalConfig = compositionConfig;
      }
      
      // 追加の質問がある場合のみ更新
      if (additionalConfig.length > 0) {
        setFormConfig([...baseFormConfig, ...additionalConfig]);
      }
    }
  }, [formData['page3']]);

  const totalPages = formConfig.length;

  const handleNext = () => {
    const currentConfig = formConfig[currentPage];
    const currentValue = formData[currentConfig.id];
    
    // 任意の項目（want4など）はスキップ可能
    if (!currentConfig.optional && (!currentValue || currentValue.trim() === '')) {
      setErrorMessage('入力または選択してください');
      return;
    }
    
    setErrorMessage('');
    
    if (currentPage < formConfig.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleInputChange = (pageId, value) => {
    setFormData({
      ...formData,
      [pageId]: value
    });
    setErrorMessage('');
  };

  const handleSubmit = () => {
    // 学年の変換マップ
    const gradeMap = {
      '小学1年生': 's1',
      '小学2年生': 's2',
      '小学3年生': 's3',
      '小学4年生': 's4',
      '小学5年生': 's5',
      '小学6年生': 's6',
      '中学1年生': 't1',
      '中学2年生': 't2',
      '中学3年生': 't3',
      '高校1年生': 'k1',
      '高校2年生': 'k2',
      '高校3年生': 'k3'
    };

    // 先生の変換マップ
    const teacherMap = {
      '🦏サイ先生': 'DESC法',
      '🐿️リス先生': 'PREP法',
      '🦁ライオン先生': '一段落目が個性的なPREP法'
    };

    // タイプの変換マップ
    const typeMap = {
      '読書感想文': 'bookReview',
      'テーマのある作文': 'composition'
    };

    const selectedType = formData['page3'];
    
    // 変換されたデータを作成
    const result = {
      timestamp: new Date().toISOString(),
      grade: gradeMap[formData['page1']] || formData['page1'],
      sensei: teacherMap[formData['page2']] || formData['page2'],
      type: typeMap[selectedType] || selectedType,
      responses: {}
    };

    // タイプに応じてデータを整形
    if (selectedType === '読書感想文') {
      result.responses = {
        bookReviewFirst: formData['bookType'] || '',
        bookReviewArasuji: formData['arasuji'] || '',
        bookReviewSecond: formData['kokoro'] || '',
        bookReviewThing: formData['hyoushi'] || '',
        bookReviewThird: formData['other'] || ''
      };
    } else if (selectedType === 'テーマのある作文') {
      result.responses = {
        sTheme: formData['theme'] || '',
        sFirst: formData['want1'] || '',
        sSecond: formData['want2'] || '',
        sThird: formData['want3'] || '',
        sFo: formData['want4'] || ''
      };
    }
    
    console.log('送信データ:', JSON.stringify(result, null, 2));
    
    if (onSubmit) {
      onSubmit(result);
    } else {
      alert('フォームが送信されました!\n\n' + JSON.stringify(result, null, 2));
    }
  };

  const handleClose = () => {
    if (onSubmit) {
      onSubmit(null);
    }
  };

  const currentConfig = formConfig[currentPage];
  const currentValue = formData[currentConfig.id] || '';

  const getTeacherImage = () => {
    if (currentConfig.id === 'page2') {
      const selectedTeacher = formData['page2'];
      if (selectedTeacher === '🦏サイ先生') {
        return '/images/saisensei.png';
      } else if (selectedTeacher === '🐿️リス先生') {
        return '/images/risusensei.png';
      } else if (selectedTeacher === '🦁ライオン先生') {
        return '/images/raionsensei.png';
      }
    }
    return currentConfig.image;
  };

  // 最後のページかどうかを判定（formConfigの長さで判定）
  const isLastPage = currentPage === formConfig.length - 1;

  return (
    <Box>
      <div style={{
        width:"100vw",
        height:"100vh",
        position:"fixed",
        top:0,
        left:0,
        backgroundColor:"rgba(0,0,0,0.5)",
        zIndex:1
      }} />
      <Card 
        variant='outlined' 
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "600px",
          height: "80%",
          maxHeight: "700px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          border: "3px solid rgba(0,0,0,0.1)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000
        }}
      >
        <Button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "7px",
            right: "16px",
            minWidth: "40px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            padding: 0,
            color: "#666",
            fontSize: "24px"
          }}
          className='close'
        >
          ×
        </Button>

        <StepIndicator currentStep={currentPage} totalSteps={totalPages} />

        <Box style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", width:"400px", margin:"auto" }}>
          <img 
            src={getTeacherImage()} 
            alt={`Step ${currentPage + 1}`}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />

          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
            {currentConfig.question}
          </h2>

          {currentConfig.type === 'text' && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder={currentConfig.placeholder}
              value={currentValue}
              onChange={(e) => handleInputChange(currentConfig.id, e.target.value)}
            />
          )}

          {currentConfig.type === 'textarea' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder={currentConfig.placeholder}
              value={currentValue}
              onChange={(e) => handleInputChange(currentConfig.id, e.target.value)}
            />
          )}

          {currentConfig.type === 'radio' && (
            <FormControl component="fieldset">
              <RadioGroup
                value={currentValue}
                onChange={(e) => handleInputChange(currentConfig.id, e.target.value)}
              >
                {currentConfig.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {currentConfig.type === 'select' && (
            <FormControl fullWidth>
              <InputLabel
              style={{
                fontSize:"15px",
                fontWeight:"bold"
              }}>{currentConfig.label}</InputLabel>
              <Select
                value={currentValue}
                label={currentConfig.label}
                style={{
                  fontSize:"15px",
                  fontWeight:"bold"
                }}
                onChange={(e) => handleInputChange(currentConfig.id, e.target.value)}
              >
                {currentConfig.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {errorMessage && (
          <Box style={{ 
            color: '#FF1493', 
            fontSize: '14px', 
            marginTop: '8px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {errorMessage}
          </Box>
        )}

        <Box style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={currentPage === 0}
            style={{ minWidth: "100px",marginRight: "16px",backgroundColor:"black",color:"white" }}
          >
            もどる
          </Button>

          {isLastPage ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              style={{ minWidth: "100px",marginLeft: "16px",backgroundColor:"black" }}
            >
              送信
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              style={{ minWidth: "100px",marginLeft: "16px",backgroundColor:"black" }}
            >
              つぎへ
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}