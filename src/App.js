import React, { Component } from 'react';
import './App.css';

let originalArray=[];

class App extends Component {
  constructor(props){
    super(props)
    this.state={noOfRowsAndColumns:0,elements:[],isValid:false,message:''}
  }


  handleChange(event){
    let row= parseInt(event.target.value)
      this.state.elements=[]
       this.state.isValid=false;
      this.state.message=''      

    if(row>0&&row<=100){
      this.state[event.target.name]=parseInt(event.target.value);
      this.generateGrid()
    }else{
      this.state.message=''; // We can provide some message if input is blank      
    }
      this.setState(this.state)
  }

  generateGrid(){
    this.state.elements=[]
    this.setState(this.state)
    let noOfRowsAndColumns=this.state.noOfRowsAndColumns*this.state.noOfRowsAndColumns
    let temp=[]
    for(let i=1;i<= noOfRowsAndColumns;i++){
        temp.push(i)
    }
    originalArray=JSON.parse(JSON.stringify(temp))
    let shuffledArray=this.Shuffle(temp)
    while (shuffledArray.length > 0)
          this.state.elements.push(shuffledArray.splice(0, this.state.noOfRowsAndColumns));
    this.setState(this.state)
  }
   Shuffle(array) { for(let j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x); return array;};


  dragStart(arrayIndex,elements,eleIndex1,event) { 
    if(!this.state.isValid){
      let dragObject={
        arrayIndex,
        elements,
        eleIndex1
      }
      event.dataTransfer.setData('dragObject',JSON.stringify(dragObject)) 
    }
  }

  preventDefault(event) {
    event.preventDefault();
  }

  drop(arrayIndex,elements,eleIndex,event) {
    if(!this.state.isValid){
          try {
            let dragObject = JSON.parse(event.dataTransfer.getData('dragObject'));
            if(arrayIndex!=dragObject.arrayIndex){     
                let x = dragObject.elements[dragObject.eleIndex1];
                dragObject.elements[dragObject.eleIndex1] = elements[eleIndex];
                elements[eleIndex] = x;
                this.state.elements[arrayIndex]=elements;
                this.state.elements[dragObject.arrayIndex]=dragObject.elements;
               }else{
                let x = elements[dragObject.eleIndex1];
                elements[dragObject.eleIndex1] = elements[eleIndex];
                elements[eleIndex] = x;
                this.state.elements[arrayIndex]=elements;         
               }
               let newArray=this.mergeArray();
               this.state.isValid=this.checkIfEqual(newArray)
               this.setState(this.state)
              
              
          } catch (e) {
                console.log("e",e)
            
            return;
          }
    }
  }
  
  mergeArray(){
    let i=0;
         let newArray=[];
         while(this.state.elements.length > i){   
            newArray=[...newArray,...this.state.elements[i]]
            i++;
         }
         return newArray;
  }

 checkIfEqual(arr2) {

  if (originalArray.length != arr2.length) {
    return false;
  }
  return originalArray.join() == arr2.join();
}

render() {
    return (

    <div className="wrapper">
        <div className="header">
            <h1>Prove yourself to become part of TEAM</h1>
            <input type="number" className="input" placeholder="Enter number" name="noOfRowsAndColumns" onChange={this.handleChange.bind(this)} />
        </div>
        <div className="message">
            <p>{this.state.isValid?'Congrats! You did it, Welcome to the Team.':''}</p>
              <p>{!this.state.isValid?this.state.message:''}</p>
        </div>
        <div className="box-container">
          {
          this.state.elements.map((elements,index)=>{
            return(
            <div className="box-row" key={index}>
                <div className="box-items">
                    {elements.map((el,index1)=>{
                        return <div draggable='true' onDragStart={this.dragStart.bind(this,index,elements,index1)} className="col" key={index1} onDragOver={this.preventDefault.bind(this)} onDrop={this.drop.bind(this,index,elements,index1)}>{el}</div>
                        })}
                </div>
            </div>
           
            )
          })
        }
        </div>
    </div>     
    );
  }
}

export default App;
