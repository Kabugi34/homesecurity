import {useState,useRef} from "react";
import axios from "axios";

export function useTrainModel() {
    const [progress ,setProgress] = useState(0);
    const[status,setStatus] = useState("idle");
    const timerRef =useRef(null);

    const train=async () =>{
        setStatus("training");
        setProgress(0);

        //simulation of training process before server response
        timerRef.current = setInterval(() => {
            setProgress(p =>Math.min(p+Math.random()*15,80));

    },300);

    try {
        await axios.post("http://localhost:8000/train/");
        clearInterval(timerRef.current);
        setProgress(100);
        setStatus("success");

    }catch (err){
        clearInterval(timerRef.current);
        setStatus("error");
        console.error("retrain failed:",err);
        }
    };
    return {progress,status,train};

}

