import React from "react";
import ReactDOM from "react-dom";
import './index.css';

function Square (props){
    return (
        <button className={`square ${props.winner}`} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component{
    renderSquare(i){
        let winnerclass = ""
        if(this.props.winners!==null && this.props.winners?.includes(i)){
            winnerclass="winner"
        }
        return(
            <Square 
                winner={winnerclass}
                value={this.props.squares[i]} 
                onClick={()=>this.props.onClick(i)}
            />
        )
    }
    render(){
        let elements = []
        for(let i=0;i<3;i++){
            let bees = []
            for(let j=0;j<3;j++){
                bees.push(this.renderSquare(i*3+j))
            }
            let boardRow = <div className="board-row">{bees}</div>
            elements.push(boardRow)
        }
        return (
            <div>
                {elements}
            </div>
        )
    }
}


class Game extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            orderAsc: true,
        }
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
        })
    }
    handleClick(i){
        const history =this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }
    reorder(){
        this.setState({
            orderAsc: !this.state.orderAsc
        })
    }
    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)
        let moves = history.map((step,move) =>{
            let lastOne = parseInt(step.squares
                .map((elem,index)=>`${elem}:${index}`)
                .filter(elemF=>history[move-1]?.squares.map((e,i)=>`${e}:${i}`).includes(elemF)==false)[0]?.split(':')[1]
            ,10)

            const description = move ?
                `Go to turn # ${move} : (${Math.floor(lastOne/3)+1},${lastOne%3+1})`
                    // .filter((fi,fa)=>history[move-1].squares
                    //     .map((i,a)=>i+":"+a).includes(fi+":"+fa)==false)
                :'Go to start ' ;
            return (
                <li key={move}>
                    <button className={this.state.stepNumber===move?'colorThis':''} onClick={()=>this.jumpTo(move)}>
                        {description}
                    </button>
                </li>
            )
        })
        moves = this.state.orderAsc?moves:moves.reverse()
        let status
        if (winner) {
            status = `Player ${winner[3]} won`
        }else if(this.state.history.length===10){
            status = "The game is drawn"
        }else{
            status = "Next player: "+(this.state.xIsNext?'X':'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i)=>{this.handleClick(i)}}
                        winners={winner}
                    />
                </div>
                <div className ="game-info">
                    <div>{status}</div>
                    <button className={`reorder ${history.length!==1?"":"reorder-hide"}`} onClick={()=>{this.reorder()}}>Reorder</button>
                    <ol>{moves}</ol>
                    
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById("root")
)

function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    for(let i=0;i<lines.length;i++){
        const [a,b,c] = lines[i];
        if (squares[a] &&squares[a]===squares[b]&&squares[a]===squares[c]){
            return [a,b,c,squares[a]];
        }
    }
    return null
}