(function(){
	function Gobang(){
		return new Gobang.prototype.init();
	}

	Gobang.fn=Gobang.prototype={
		constructor:Gobang,
		// 初始化数据
		initData:function(){
			// 获取元素
			this.app=document.getElementById('app');
			this.context=app.getContext('2d');
			this.gobackBtn=document.getElementById('goback');
			this.recoverBtn=document.getElementById('recover');
			this.reloadBtn=document.getElementById('reload');

			// 当前玩家
			this.player=true;

			// 棋盘落子初始化
			var chessBoard=[];
			for (var i = 0; i < 15; i++) {
				chessBoard[i]=[];
				for (var j=0;j<15;j++) {
					chessBoard[i][j]=0;
				}
			}
			this.chessBoard=chessBoard;

			// 当前步数
			this.stepCount=0;
			// 落子历史记录
			this.stepRecord=[];
			// 悔棋步数
			this.gobackStep=0;
			// 棋局是否结束
			this.isOver=false;
		},

		// 绘制棋盘
		drawChessBoard:function(){
			var context=this.context;
			context.strokeStyle='#766140';
			for(var i=0;i<15;i++){
				// 横线
				context.moveTo(15,15+i*30);
				context.lineTo(435,15+i*30);
				context.stroke();
				// 垂直线
				context.moveTo(15+i*30,15);
				context.lineTo(15+i*30,435);
				context.stroke();
			}
		},
		// 添加棋子
		drawChesspiece:function(x,y,player){
			var context=this.context;
			context.beginPath();
			context.arc(15+x*30,15+y*30,13,0,Math.PI*2);
			context.closePath();
			// 渐变
			var gradient=context.createRadialGradient(15+x*30,15+y*30,15,15+x*30,15+y*30,0);
			if(player){
				gradient.addColorStop(0,'#0a0a0a');
				gradient.addColorStop(1,'#636766');
			}else{
				gradient.addColorStop(0,'#D1D1D1');
				gradient.addColorStop(1,'#F9F9F9');
			}
			context.fillStyle=gradient;
			context.fill();

			// 落子位置标记
			this.chessBoard[x][y]=player;

			// 落子记录
			this.stepCount++;
			this.stepRecord[this.stepCount]=[x,y,player];
		},
		// 移除棋子
		removeChesspiece:function(i,j){
			var context=this.context;
			// 从画布移除棋子
			context.clearRect(i* 30, j* 30, 30, 30);
			context.strokeStyle='black';
			context.beginPath();
			// 棋子在中间
			if(i!==0&&i!==14&&j!==0&&j!==14){
				context.moveTo(i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}
			// 棋子在左边界
			if(i===0 && j!==0 && j!==14){
				context.moveTo(15+i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}
			// 棋子在右边界
			if(i===14 && j!==0 && j!==14){
				context.moveTo(i*30,15+j*30);
				context.lineTo(15+i*30,15+j*30);
				context.moveTo(15+i*30,j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}

			// 棋子在上边界
			if(j===0&& i!==0 && i!==14){
				context.moveTo(i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}
			// 棋子在下边界
			if(j===14&& i!==0 && i!==14){
				context.moveTo(i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,j*30);
				context.lineTo(15+i*30,15+j*30);
			}
			// 棋子在左上角
			if(j===0 && i===0){
				context.moveTo(15+i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}
			// 棋子在右上角
			if(i===14 && j===0){
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(i*30,15+j*30);
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(15+i*30,(j+1)*30);
			}
			// 棋子在左下角
			if(i===0 && j===14){
				context.moveTo(15+i*30,15+j*30);
				context.lineTo((i+1)*30,15+j*30);
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(15+i*30,j*30);
			}
			// // 棋子在右下角
			if(i===14 && j===14){
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(i*30,15+j*30);
				context.moveTo(15+i*30,15+j*30);
				context.lineTo(15+i*30,j*30);
			}
        
            context.stroke();
		},
		// 统计所有赢法
		getAllWins:function(){
			var wins=[];
			// 赢法数组初始化
			for (var i = 0; i < 15; i++) {
				wins[i]=[];
				for(var j=0;j<15;j++){
					wins[i][j]=[];
				}
			}

			// 所有的赢法
			// 横向所有的赢法
			var count=0;
			for(var i=0;i<11;i++){
				for(var j=0;j<15;j++){
					for(var k=0;k<5;k++){
						wins[i+k][j][count]=true;
					}
					count++;
				}
			}
			// 纵向所有的赢法
			for(var i=0;i<15;i++){
				for(var j=0;j<11;j++){
					for(var k=0;k<5;k++){
						wins[i][j+k][count]=true;
					}
					count++;
				}
			}
			// 正斜向所有赢法
			for(var i=0;i<11;i++){
				for(var j=4;j<15;j++){
					for(var k=0;k<5;k++){
						wins[i+k][j-k][count]=true;
					}
					count++;
				}
			}
			// 反斜向所有的赢法
			for(var i=0;i<11;i++){
				for(var j=10;j>-1;j--){
					for(var k=0;k<5;k++){
						wins[i+k][j+k][count]=true;
					}
					count++;
				}
			}
			this.wins=wins;
			this.count=count;

			// 玩家连子统计初始化
			this.playerWin=[];
			this.robotWin=[];
			for(var k=0;k<count;k++){
				this.playerWin[k]=0;
				this.robotWin[k]=0;
			}
		},
		// 走棋
		oneStep:function(){
			var _this=this;
			this.app.onclick=function(e){
				if(_this.isOver)return;
				var x=Math.floor(e.offsetX/30);
				var y=Math.floor(e.offsetY/30);
				if(_this.chessBoard[x][y]!==0)return;
				// 落子
				_this.drawChesspiece(x,y,_this.player);
				// 悔棋步数恢复为0
				_this.gobackStep=0;
				// 玩家连子统计，输赢判断
				_this.playersWins(x,y);
				
				// 电脑走棋
				if(!_this.isOver){
					// 切换玩家
					_this.player=!_this.player;
					_this.robotStep();
				}
			}
		},
		// 玩家连子统计
		playersWins:function(i,j){
			for(var k=0;k<this.count;k++){
				if(this.wins[i][j][k]){
					this.playerWin[k]++;
					this.robotWin[k]=6;
					if(this.playerWin[k]===5){
						this.isOver=true;
						alert('玩家赢了');
					}
				}
			}
			// 记录到落子历史上
			this.stepRecord[this.stepCount][3]=this.playerWin.slice();
			this.stepRecord[this.stepCount][4]=this.robotWin.slice();
		},
		// 电脑走棋
		robotStep:function(){
			// 落子权重
			var playerScore=[];
			var robotScore=[];
			var max=0;
			var u=0,v=0;

			for(var i=0;i<15;i++){
				playerScore[i]=[];
				robotScore[i]=[];
				for(j=0;j<15;j++){
					playerScore[i][j]=0;
					robotScore[i][j]=0;
				}
			}

			// 为赢法打分
			for(var i=0;i<15;i++){
				for(var j=0;j<15;j++){
					if(this.chessBoard[i][j]===0){// 判断是否可以落子
						// 计算每个落子处的权重
						for(var k=0;k<this.count;k++){
							if(this.wins[i][j][k]){
								if(this.playerWin[k]===1){
								playerScore[i][j]+=200;
								}else if(this.playerWin[k]===2){
									playerScore[i][j]+=400;
								}else if(this.playerWin[k]===3){
									playerScore[i][j]+=1000;
								}else if(this.playerWin[k]===4){
									playerScore[i][j]+=10000;
								}

								if(this.robotWin[k]===1){
									robotScore[i][j]+=220;
								}else if(this.robotWin[k]===2){
									robotScore[i][j]+=420;
								}else if(this.robotWin[k]===3){
									robotScore[i][j]+=1200;
								}else if(this.robotWin[k]===4){
									robotScore[i][j]+=20000;
								}
							}
						}

						// 判断计算机最佳落子处
						if(playerScore[i][j]>max){
							max=playerScore[i][j];
							u=i;
							v=j;
						}else if(playerScore[i][j]===max){
							if(robotScore[i][j]>robotScore[u][v]){
								u=i;
								v=j;
							}
						}

						if(robotScore[i][j]>max){
							max=robotScore[i][j];
							u=i;
							v=j;
						}else if(robotScore[i][j]===max){
							if(playerScore[i][j]>playerScore[u][v]){
								u=i;
								v=j;
							}
						}
					}
				}
			}
			this.drawChesspiece(u,v,this.player);
			this.chessBoard[u][v]=this.player;

			// 对计算机完成落子进行统计
			for (var k=0;k<this.count;k++) {
				if(this.wins[u][v][k]){
					this.robotWin[k]++;
					this.playerWin[k]=6;
					if(this.robotWin[k]==5){
						alert('计算机赢了！！');
						this.isOver=true;
					}
				}
			}
			// 落子连子统计记录到下棋历史上
			this.stepRecord[this.stepCount][3]=this.playerWin.slice();
			this.stepRecord[this.stepCount][4]=this.robotWin.slice();

			if(!this.isOver){
				this.player=!this.player;
			}
		},
		// 游戏操作
		handle:function(){
			var _this=this;

			function getPosition(){
				_this.step=_this.stepCount-_this.gobackStep;
				console.log('悔棋步'+_this.gobackStep,'step'+_this.step,'stepCount'+_this.stepCount);
				var position=_this.stepRecord[_this.step];
				var i=position[0];
				var j=position[1];
				return [i,j];
			}

			// 悔棋
			this.gobackBtn.onclick=function(){
				function back(){
					if(_this.isOver)return;
					if(_this.gobackStep===_this.stepCount)return;
					var position=getPosition(),
						i=position[0],
						j=position[1];
					// 移除当前棋子
					_this.removeChesspiece(i,j);
		            // 落子位置恢复空位
		            _this.chessBoard[i][j]=0;
		            // 连子情况恢复到上一次
		            if(_this.step-1===0){
		            	for(var k=0;k<_this.count;k++){
		            		_this.playerWin[k]=0;
		            		_this.robotWin[k]=0;
		            	}
		            }else{
		            	_this.playerWin=_this.stepRecord[_this.step-1][3];
		            	_this.robotWin=_this.stepRecord[_this.step-1][4];
		            }
		            
					_this.gobackStep++;
				}

				back();
				back();
				
			};

			// 撤销
			this.recoverBtn.onclick=function(){
				function next(){
					if(_this.isOver)return;
					if(_this.gobackStep===0)return;
					_this.gobackStep--;
					var position=getPosition(),
						i=position[0],
						j=position[1];
					// 恢复棋子到下一次
					_this.drawChesspiece(i,j,_this.stepRecord[_this.step][2]);
					// 恢复棋位，不增加落子新记录
					_this.stepCount--;
					_this.stepRecord.length--;

					// 连子情况统计恢复到下一次
					_this.playerWin=_this.stepRecord[_this.step][3];
		            _this.robotWin=_this.stepRecord[_this.step][4];
				}
				next();
				next()	
			};

			// 重新开始
			this.reloadBtn.onclick=function(){window.location.reload();};
		},
	};

	var init=Gobang.fn.init=function(){
		// 初始化数据
		this.initData();
		// 绘制棋盘
		this.drawChessBoard();
		//统计所有赢法
		this.getAllWins();
		// 走棋
		this.oneStep();
		// 游戏操作
		this.handle();
	}
	init.prototype=Gobang.fn;
	Gobang();
})();