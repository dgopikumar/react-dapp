import { useState } from 'react';
import {ethers} from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

//const greeterDeployedAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // deployed address in local network
const greeterDeployedAddr = '0x32519c5864b65817F9D263cc788aF208288a8D36'; // deployed address in Ropsten test network
const tokenDeployedAddr = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // deployed address in local network

function App() {

  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);

  async function requestAccount(){
    await window.ethereum.request({method:'eth_requestAccounts'});
  }

  async function fetchGreeting(){
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterDeployedAddr, Greeter.abi, provider);
      try{
        const data = await contract.greet();
        console.log('Data:', data);
      }catch(err){
        console.log('Error:', err);
      }
    }
  }

  async function setGreeting(){
    if(!greeting) return;
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterDeployedAddr, Greeter.abi, signer);
      const transaction = contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait;
      fetchGreeting();
    }
  }

  async function getBalance(){
    if(typeof window.ethereum !== 'undefined'){
      const [account] = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenDeployedAddr, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance:", balance.toString());
    }
  }

  async function sendCoins(){
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenDeployedAddr, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} of coins successfully sent to address: ${userAccount}`);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input placeholder="Set Greeting" value={greeting} onChange={e => setGreetingValue(e.target.value)} />
        <br/>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input placeholder="Account ID" onChange={e => setUserAccount(e.target.value)} />
        <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      </header>
    </div>
  );
}

export default App;
