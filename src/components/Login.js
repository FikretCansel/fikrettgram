import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";

function Login() {
  const [control, setControl] = useState(false);
    const [username,setUsername]=useState("");
    const [passworld,setPassworld]=useState("");

  const Registerfuc = () => {
    setControl(true);
  };
  const Singinfuc=()=>{
    setControl(false);
  }
  return (
    <div>
      <Button onClick={Singinfuc}>Sing in</Button>
      <Button onClick={Registerfuc}>Register</Button>

      <div className="card">
        <div className="card-header">
          {control ? <h2>Register</h2> : <h2>Sing in</h2>}
        </div>
        <div className="card-body">
            <form>
        <Input type="text" placeholder="username" value={username} onChange={event=>{setUsername(event.target.value)}}/>
        <Input type="text" placeholder="passworld" value={passworld} onChange={event=>{setPassworld(event.target.value)}} />
        {control ? (
          <Button type="submit" >Register</Button>
        ) : (
          <Button type="submit" >Sing in</Button>
        )}
      </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;
