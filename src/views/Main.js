import React from 'react';
import axios from 'axios';
import Socket from 'socket.io-client';
let Io;

function Main() {

    const ENDPOINT = "http://localhost:3005"

    const [buyData, setBuyData] = React.useState({price: "", amount: ""});
    const [sellData, setSellData] = React.useState({price: "", amount: ""});
    const [limitTradeBuy, setLimitTradeBuy] = React.useState([]);
    const [limitTradeSell, setLimitTradeSell] = React.useState([]);

    React.useEffect(() => {
        Io = Socket(ENDPOINT);
        Io.on('btcusd-limit', data => {
            console.log(data)
            if (data.pair === 'btcusd') {
                let buy = [];
                let sell = [];
                data.trades.forEach(item => {
                    if (item.order_type === 'buy') {
                        buy.push(item)
                    }else {
                        sell.push(item)
                    }
                })
                setLimitTradeSell(sell.sort(function(a, b){return a-b}));
                setLimitTradeBuy(buy.sort())
            }
        })

        Io.on('btcusd-limit-check', data => {
            console.log(data);
           if (data.pair === 'btcusd') {
            let buy = [];
            let sell = [];
            data.trades.forEach(item => {
                if (item.order_type === 'buy') {
                    buy.push(item)
                }else {
                    sell.push(item)
                }
            })
            setLimitTradeSell(sell.sort(function(a, b){return a-b}));
            setLimitTradeBuy(buy.sort())
           }
        })

    },[ENDPOINT])

    const handleBuy = (e) => {
        setBuyData({...buyData, [e.target.name]: e.target.value});
    };

    const handleSell = e => {
        setSellData({...sellData, [e.target.name]: e.target.value});
    };

    const sendBuy = (e) => {
        e.preventDefault();
        axios({
            url: 'http://localhost:3005/trade/limit/buy',
            method: 'POST',
            headers: {
                jwttoken: localStorage.getItem('codeotoken')
            },
            data: {
                price: buyData.price,
                amount: buyData.amount,
                order_type: 'buy',
                pair: 'btcusd',
                currency: 'btc'
            }
        })
        .then(({data}) => {
            console.log("Success");
        })
        .catch(err => {
            console.log(err);
        })
    };

    const sendSell = e => {
        e.preventDefault();
        axios({
            url: 'http://localhost:3005/trade/limit/sell',
            method: 'POST',
            headers: {
                jwttoken: localStorage.getItem('codeotoken')
            },
            data: {
                price: sellData.price,
                amount: sellData.amount,
                order_type: 'sell',
                pair: 'btcusd',
                currency: 'btc'
            }
        })
        .then(({data}) => {
            console.log("Success");
        })
        .catch(err => {
            console.log(err);
        })
    };

    React.useEffect(() => {
        axios({
            url: 'http://localhost:3005/trade/limit/btc',
            method: 'GET',
        })
        .then(({data}) => {
            let sell = [];
            let buy = [];
            data.limitTrades.forEach(item => {
                if (item.order_type === 'buy') {
                    buy.push(item);
                }else {
                    sell.push(item)
                }
            })
            setLimitTradeSell(sell.sort(function(a, b){return a-b}));
            setLimitTradeBuy(buy.sort())
        })
        .catch(err => {
            console.log(err);
        })
    },[]);

    const tradeLimitSellList = limitTradeSell.map(item => {
        return (
            <tr>
                <td>
                    $ {item.price}
                </td>
                <td>
                    {item.amount}
                </td>
                <td>
                    {item.total}
                </td>
                <td>
                    {item.filled}
                </td>
                
            </tr>   
        )
    });

    const tradeEmpty = () => {
        return (
            <React.Fragment>
                <tr>
                <td>
                    
                </td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                 
                </td>
                
            </tr>

            <tr>
                <td>
                    
                </td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                 
                </td>
                
            </tr>

            <tr>
                <td>
                    
                </td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                 
                </td>
                
            </tr>
            </React.Fragment>
        )
    }

    const tradeLimitBuyList = limitTradeBuy.map(item => {
        return (
            <tr>
            <td>
                $ {item.price}
            </td>
            <td>
                {item.amount}
            </td>
            <td>
                {item.total}
            </td>
            <td>
                    {item.filled}
            </td>
        </tr>   
        )
    })

    return (
        <React.Fragment>

            <div>
                <h2>Buy</h2>
                <form onSubmit={sendBuy}>
                <input placeholder="Price" name="price" onChange={handleBuy} />
                <br />
                <input placeholder="Amount" name="amount" onChange={handleBuy} />
                <br />
                <button type="submit">Submit</button>
                </form>
            </div>

            <div>
                <h2>Sell</h2>
                <form onSubmit={sendSell}>
                    <input name="price" placeholder="Price" onChange={handleSell} />
                    <br />
                    <input name="amount" placeholder="Amount" onChange={handleSell} />
                    <br />
                    <button>Submit</button>
                </form>
            </div>


            <table style={{width: '20%'}}>
                <thead>
                    <tr>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th>Filled</th>
                    </tr>
                </thead>
                <tbody>
                   {limitTradeBuy.length > 0 ? tradeLimitBuyList : tradeEmpty}
                    <tr>
                        <td style={{backgroundColor: 'black'}}>
                            ++++
                        </td>
                        <td  style={{backgroundColor: 'black'}}>
                            ++++
                        </td>
                        <td  style={{backgroundColor: 'black'}}>
                            ++++
                        </td>
                        <td  style={{backgroundColor: 'black'}}>
                            ++++
                        </td>
                    
                    
                    </tr>   

                   {limitTradeSell.length > 0 ? tradeLimitSellList : ""}

                </tbody>
            </table>

        </React.Fragment>
    )

};

export default Main;