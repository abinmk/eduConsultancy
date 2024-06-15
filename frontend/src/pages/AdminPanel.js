import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const AdminPanel = () => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('/exams');
        setExams(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExams();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/exams/create', { title, description, questions });
      // Fetch exams again to update the list
      const res = await axios.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        {questions.map((q, qIndex) => (
          <div key={qIndex}>
            <input type="text" name="question" value={q.question} onChange={(e) => handleQuestionChange(qIndex, e)} placeholder="Question" required />
            {q.options.map((option, oIndex) => (
              <input key={oIndex} type="text" name={`option${oIndex}`} value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e)} placeholder={`Option ${oIndex + 1}`} required />
            ))}
            <input type="text" name="answer" value={q.answer} onChange={(e) => handleQuestionChange(qIndex, e)} placeholder="Answer" required />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>Add Question</button>
        <button type="submit">Create Exam</button>
      </form>
      <div>
        <h2>Exams</h2>
        {exams.map((exam) => (
          <div key={exam._id}>
            <h3>{exam.title}</h3>
            <p>{exam.description}</p>
            <ul>
              {exam.questions.map((q, index) => (
                <li key={index}>{q.question}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
