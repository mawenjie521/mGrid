(function($){
    var _options={
        style:{
            borderWidth:1,
            borderColor:"#ccc",
            borderStyle:"solid",
            width:140,
            height:40,
            fontSize:14,
            fontColor:"#555",
            lineHeight:"40px",
            textAlign:"center",
            backgroundColor:"#fff",
            color:"#555",
            top:"0px",
            left:"0px"
        },
        data:{
            xCount:10,
            yCount:10
        }
    };

    _const={
        name:"",
    },

    _data={};


    /*start所有对象*/
    function ChartObj(name){
        this.name = name;
        this.nodesObj = {};
        this.xCount=0;
        this.yCount = 0;
        this.colData={};
        this.rowData={};
        this.height = 0;
        this.width = 0;
    }

    ChartObj.prototype.setXCount = function(xCount){
        this.xCount = xCount;
    }

    ChartObj.prototype.setYCount = function(yCount){
        this.yCount = yCount;
    }

    ChartObj.prototype.getNode=function(id){
        return this.nodesObj[id];
    }

    ChartObj.prototype.addNode=function(node){
        if(!node.isMerged){
            this.nodesObj[node.id]=node;
            
            var left="0px", top="0px", width = 0, height = 0;
            if(node.colSpans == 1 && node.rowSpans == 1){
                if(node.colIndex > 1){
                    var leftNode=this.getNodeByIndex(node.colIndex-1, node.rowIndex);
                    left = leftNode.left()+leftNode.width()+leftNode.borderWidth();
                    node.left(left);
                    node.height(leftNode.height());
                }

                if(node.rowIndex>1){
                   var topNode=this.getNodeByIndex(node.colIndex, node.rowIndex-1);
                    top = topNode.top()+topNode.height()+topNode.borderWidth();
                    node.top(top);
                    node.width(topNode.width()); 
                }
            }
            
            node.parentDom.drawDiv(node);
        }   
    }

    ChartObj.prototype.getNodeByIndex=function(colIndex, rowIndex){
        var id = $.createId(colIndex, rowIndex);
        return this.nodesObj[id];
    }

    ChartObj.prototype.removeNodes=function(sColIndex, sRowIndex, eColIndex, eRowIndex){
        if(!eColIndex||!eRowIndex||eColIndex==0||eRowIndex==0){
            var id = $.createId(sColIndex, sRowIndex);
            var node = this.nodesObj[id];
            $("#"+id).remove();
            if(node.colIndex!=sColIndex && node.rowIndex!=sRowIndex) node.isMerged=true;
        }

        if((sColIndex||sRowIndex)){
            if((eColIndex>sColIndex)&&(eRowIndex===sRowIndex)){
                for(var xi=sColIndex;xi<eColIndex;xi++){
                    var id = $.createId(xi, sRowIndex);
                    var node = this.nodesObj[id];
                    var colIndex = xi;
                    var id = $.createId(colIndex, sRowIndex);
                    $("#"+id).remove();
                    if(node.colIndex!=sColIndex && node.rowIndex!=sRowIndex) node.isMerged=true;
                }
            }

            if((eColIndex==sColIndex)&&(eRowIndex>sRowIndex)){
                for(var yi=sRowIndex;yi<eRowIndex;yi++){
                    var id = $.createId(sColIndex, yi);
                    var node = this.nodesObj[id];
                    var rowIndex = yi;
                    var id = $.createId(sColIndex, rowIndex);
                    $("#"+id).remove();
                    if(node.colIndex!=sColIndex && node.rowIndex!=sRowIndex) node.isMerged=true;
                }
            }
        }

        if((sColIndex||sRowIndex)&&(eColIndex>sColIndex)&&(eRowIndex>sRowIndex)){
            for(var i=0,cl=eColIndex-sColIndex;i<cl;i++){
                for(var j=0,rl=eRowIndex-sRowIndex;j<rl;j++){
                    var colIndex = sColIndex+i, rowIndex = sRowIndex+j;
                    var id = $.createId(colIndex, rowIndex);
                    var node = this.nodesObj[id];
                    var id = $.createId(colIndex, rowIndex);
                    $("#"+id).remove();
                    if(node.colIndex!=sColIndex && node.rowIndex!=sRowIndex) node.isMerged=true;
                }
            }
        }
    }


    function Node(id,colIndex,rowIndex){
        this.id=id;
        this.name="";

        this.colIndex=colIndex;
        this.rowIndex=rowIndex;
        this.colSpans = 1;
        this.rowSpans=1;

        this.isMerged = false;
        
        this.style =$.extend(true, {}, _options.style);
        
        this.parentDom=null;
    }

    Node.prototype.content=function(name){
        if(arguments.length>0){
            $("#"+this.id).html(name);
            this.name = name;
        }else{
            return this.name;
        }
    }

    Node.prototype.width=function(width){
        if(arguments.length>0){
            $("#"+this.id).css("width", width);
            this.style.width=width;
        }else{
            return this.style.width;
        }
    }

    Node.prototype.height=function(height){
        if(arguments.length>0){
            $("#"+this.id).css("height", height);
            this.style.height=height;
        }else{
           return this.style.height; 
       } 
    }

    Node.prototype.borderWidth=function(width){
        if(arguments.length>0){
            //$("#"+this.id).css("border-width", width);
            this.style.borderWidth=width;
        }else{
            return this.style.borderWidth;
        }
    }

    Node.prototype.borderColor=function(color){
        if(arguments.length>0){
            $("#"+this.id).css("border-color", color);

            var colIndex = this.colIndex, rowIndex = this.rowIndex;
            var chartObj = $.dealChartObj(_const.name);

            if(colIndex>0){
                var leftNode = chartObj.getNodeByIndex(colIndex-1, rowIndex);
                leftNode.borderRightColor(color)
            }

            if(rowIndex>0){
                var topNode = chartObj.getNodeByIndex(colIndex, rowIndex-1);
                topNode.borderBottomColor(color);
            }

            this.style.borderColor = color;
        }else{
            return this.style.borderColor;
        }
    }

    Node.prototype.borderBottomColor=function(color){
        if(arguments.length>0){
            $("#"+this.id).css("border-bottom-color", color);

            this.style.borderBottomColor = color;
        }else{
            return this.style.borderBottomColor;
        }
    }

    Node.prototype.borderRightColor=function(color){
        if(arguments.length>0){
            $("#"+this.id).css("border-right-color", color);
            this.style.borderRightColor = color;
        }else{
            return this.style.borderRightColor;
        }
    }

    Node.prototype.bgColor=function(color){
        if(arguments.length>0){
            $("#"+this.id).css("background-color", color);
            this.style.backgroundColor=color;
        }else{
            return this.style.backgroundColor;
        }
    }

    Node.prototype.fColor=function(color){
        if(arguments.length>0){
            $("#"+this.id).css("color", color);
            this.style.fontColor=color;
        }else{
            return this.style.fontColor;
        }
    }

    Node.prototype.fSize=function(size){
        if(arguments.length>0){
            $("#"+this.id).css("font-size", size);
            this.style.fontSize=size;
        }else{
            return this.style.fontSize;
        }
    }

    Node.prototype.lineHeight=function(height){
        if(arguments.length>0){
            $("#"+this.id).css("line-height", height+"px");
            this.style.lineHeight = height+"px";
        }else{
            return parseInt(this.style.lineHeight);
        }
    }

    Node.prototype.top=function(top){
        if(arguments.length>0){
            $("#"+this.id).css("top", top+"px");
            this.style.top=top+"px";
        }else{
            return parseInt(this.style.top);
        }
    }

    Node.prototype.left=function(left){
        if(arguments.length>0){
            $("#"+this.id).css("left", left+"px");
            this.style.left=left+"px";
        }else{
            return parseInt(this.style.left);
        }
    }

    Node.prototype.colSpansN = function(colSpans){
        if(arguments.length>0){
            if(this.rowSpans>1){
                throw "rowSpans must be 1";
            }
            var sColIndex = this.colIndex, 
            sRowIndex = this.rowIndex,
            theColSpans = this.colSpans,
            xCount= _options.data.xCount,
            charObj = $.dealChartObj(_const.name),
            oldNode = this;
            colSpans=sColIndex+theColSpans+colSpans-1>xCount?xCount-sColIndex-theColSpans+2:colSpans;
            var eColIndex = sColIndex+colSpans+theColSpans-1;
            var width=0;

            for(var i=sColIndex;i<eColIndex;i++){
                var nextNode=charObj.getNodeByIndex(i, sRowIndex);
                if(nextNode)
                    width+=(nextNode.width()+nextNode.borderWidth());
            }
            charObj.removeNodes(sColIndex,sRowIndex,eColIndex,sRowIndex);

            oldNode.colSpans = colSpans;
            oldNode.width(width-1);

            charObj.addNode(oldNode);
        }else{
            return this.colSpans;
        }
    }

    Node.prototype.rowSpansN=function(rowSpans){
        if(arguments.length>0){
            if(this.colSpans>1){
                throw "colSpans must be 1";
            }
            var sColIndex = this.colIndex, 
            sRowIndex = this.rowIndex,
            theRowSpans = this.rowSpans,
            yCount=_options.data.yCount,
            charObj = $.dealChartObj(_const.name),
            oldNode = this;
            rowSpans=sRowIndex+theRowSpans+rowSpans-1>yCount?yCount-sRowIndex-theRowSpans+2:rowSpans;
            var eRowIndex = sRowIndex+rowSpans+theRowSpans-1;
            var height=0;

            for(var i=sRowIndex;i<eRowIndex;i++){
                var nextNode=charObj.getNodeByIndex(sColIndex, i);
                if(nextNode)
                    height+=(nextNode.height()+nextNode.borderWidth());
            }
            charObj.removeNodes(sColIndex,sRowIndex,sColIndex,eRowIndex);

            oldNode.rowSpans = rowSpans;
            oldNode.height(height-1);
            oldNode.lineHeight(height-1);

            charObj.addNode(oldNode);
        }else{
            return this.rowSpans;
        }  
    }

    Node.prototype.mergeCells = function(colSpans, rowSpans){
        var sColIndex = this.colIndex, 
        sRowIndex = this.rowIndex, 
        eColIndex = sColIndex+colSpans, 
        eRowIndex = sRowIndex+rowSpans;
        var charObj = $.dealChartObj(_const.name);
        var oldNode = this;

        var width = oldNode.width()*colSpans+oldNode.borderWidth()*(colSpans-1);
        var height = oldNode.height()*rowSpans+oldNode.borderWidth()*(rowSpans-1);
        charObj.removeNodes(sColIndex,sRowIndex,eColIndex,eRowIndex);

        oldNode.colSpans = colSpans;
        oldNode.rowSpans = rowSpans;
        oldNode.width(width);
        oldNode.height(height);
        oldNode.lineHeight(height);

        charObj.addNode(oldNode);
    }
    /*end所有对象*/



    $.fn.drawDiv=function(node){
        var $div = $("<div id= "+node.id+" style='position:absolute;display:inline-block; text-align:center;'>"+node.name+"</div>")
        .appendTo($(this)).css(node.style).css({"border-top":"none", "border-left":"none"});
    };

    $.drawBorder=function(_this){
        var width=(_options.style.width+_options.style.borderWidth)*_options.data.xCount;
        var height=(_options.style.height+_options.style.borderWidth)*_options.data.yCount;
        
        $(_this).css({"width":width, "height":height})
        .css({"border-width":_options.style.borderWidth, "border-style":_options.style.borderStyle, "border-color": _options.style.borderColor})
        .css({"border-right":"none","border-bottom":"none"});
    }

    $.drawContent=function(_this){
        var xCount=_options.data.xCount;
        var yCount=_options.data.yCount;

        for(var i=0;i<xCount;i++){
            for(var j=0;j<yCount;j++){
                var colIndex=i+1;
                var rowIndex=j+1;

                var id=$.createId(colIndex, rowIndex);

                var node=new Node(id, colIndex, rowIndex);
                
                node.parentDom=$(_this);
                
                node.name="";
                $.dealChartObj(_const.name).addNode(node);
            }
        }
    };

    $.createId=function(colIndex, rowIndex){
        return _const.name+"_node_"+colIndex+"_"+rowIndex;
    }

    $.dealChartObj = function(name, obj){
        if(arguments.length>1){
            _data[name] = obj;
        }else{
            return _data[name];
        }
    }

    $.fn.dimesionsChart=function(options){
        $.extend(true, _options, options);

        _const.name=$(this).attr("id");

        var charObj = new ChartObj(_const.name);
        charObj.setXCount(_options.data.xCount);
        charObj.setYCount(_options.data.yCount);

        $.dealChartObj(_const.name, charObj);

        $(this).css("position", "absolute");
        
        $.drawContent(this);
        $.drawBorder(this);

        return $.dealChartObj(_const.name);
    };

})(jQuery);