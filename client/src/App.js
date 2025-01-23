import React, { useEffect, useState,useRef } from 'react';
import { QuestionServiceClient } from './proto/questions_grpc_web_pb';
import { SearchByTitleRequest } from './proto/questions_pb'; 

const client = new QuestionServiceClient('http://localhost:8080');

function App() {
  const title = useRef();
  const [page,setPage] = useState(1);
  const [results,setResults] = useState([]);
 
  function requestSearch(){
    const searchTerm = title.current.value;
  
  if (!searchTerm) {
    console.log("terminated!")

    return;
  }

  const request = new SearchByTitleRequest();
  request.setTitle(searchTerm);
  request.setPage(page);
  request.setLimit(10);
  
  client.searchByTitle(request, {}, (err, response) => {
    if (err) {
      console.log("Error:", err);
      return;
    }
    setResults(response.getQuestionsList());

    
  });
  }
  function searchTitle(e){
      e.preventDefault();
     
      requestSearch();
    }





    useEffect(()=>{
      requestSearch();
     },[page]);



    return (
        <section className='content'>
          <div className='seach-section'>
            <form onSubmit={searchTitle}>
            <input type='text' ref={title} className='search' placeholder='Search'  />
            </form>
             </div>
          <div className='results'> 
          {results.length > 0 ? (
          <ul>
            {results.map((question) => (
              <li key={question.getId()}>
                <p>{question.getType()}</p>
                <h3>Q: {question.getTitle()}</h3>
                {
                  (question.getSolution().length >0) ?(
                    <h4>Solution: {question.getSolution()}</h4>

                  ): null
                }
                
              </li>
            ))}
          </ul>
        ) : (
          <p>No results to display</p>
        )}
        {results.length > 0 && (
  <div className='nav'>
    <button 
      className='less' 
      disabled={page === 1} 
      onClick={() => setPage(page - 1)} 
    >
      Prev
    </button>
    <button 
      className='more' 
      disabled={results.length < 10} 
      onClick={() => setPage(page + 1)}
    >
      Next
    </button>
  </div>
)}
          
          </div>

        </section>
    );
}

export default App;
