import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useRef, useCallback } from "react";
import "./Home.css"

function Home() {
  let [data, setData] = useState([]);
  let [skip, setSkip] = useState(0);
  // let [track, setTrack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    try {
      axios({
        method: "GET",
        url: `https://dummyjson.com/products?skip=${skip}&limit=5`,
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      }).then((res) => {
        let newdata = data;

        for (let i = 0; i < res.data.products.length; i++) {
          newdata.push(res.data.products[i]);
        }
        setData(newdata);
        setHasMore(res.data.products.length > 0);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError(true);
    }
    return () => cancel();
  }, [skip]);
  
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip((prevPageNumber) => prevPageNumber + 5);
        
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  console.log(data, " data")

  return (
    <div className="mainbox">
      <div className="box">
        {data.map((datas, index) => (
          <div
            ref={lastBookElementRef}
            style={{
              height: "400px",
              width: "400px",
              backgroundColor: "white",
              border:"1px solid black",
              
        
            }}
            key={datas.id}
          >
            <div
              style={{
                width: "80%",
                height: "80%",
                padding: "10%",
                
              }}
            >
              <img className="image" src={datas.images[0]} alt="" />
            </div>

            <b style={{"margin":"10%"}}>{datas.title}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
