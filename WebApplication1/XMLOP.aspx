<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="XMLOP.aspx.cs" Inherits="JavascriptComponent.XMLOP" %>

<! DOCTYPE Html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>使firefox对xml的处理兼容IE的selectSingleNode selectNodes方法 </title>
    <script type="text/javascript">
        var  isIE  =   !! document.all;

        function  parseXML(st){
             if (isIE){
                 var  result  =   new  ActiveXObject( "microsoft.XMLDOM" );
                result.loadXML(st);
            } else {
                 var  parser  =   new  DOMParser();
                 var  result  =  parser.parseFromString(st,  "text/xml" );
            }
             return  result;
        }

        if ( ! isIE){
             var  ex;
            XMLDocument.prototype.__proto__.__defineGetter__( " xml " ,  function (){
                 try {
                     return   new  XMLSerializer().serializeToString( this );
                } catch (ex){
                     var  d  =  document.createElement( " div " );
                    d.appendChild( this .cloneNode( true ));
                     return  d.innerHTML;
                }
            });
            Element.prototype.__proto__.__defineGetter__( " xml " ,  function (){
                 try {
                     return   new  XMLSerializer().serializeToString( this );
                } catch (ex){
                     var  d  =  document.createElement( " div " );
                    d.appendChild( this .cloneNode( true ));
                     return  d.innerHTML;
                }
            });
            XMLDocument.prototype.__proto__.__defineGetter__( " text " ,  function (){
                 return   this .firstChild.textContent
            });
            Element.prototype.__proto__.__defineGetter__( " text " ,  function (){
                 return   this .textContent
            });

            XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (XPath){
                 var  x = this .selectNodes(xpath)
                 if ( ! x&&x.length < 1 ) return   null ;
                 return  x[ 0 ];
            }
            XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function (xpath){
                 var  xpe  =   new  XPathEvaluator();
                 var  nsResolver  =  xpe.createNSResolver( this .ownerDocument  ==   null   ? 
                     this .documentElement :  this .ownerDocument.documentElement);
                 var  result  =  xpe.evaluate(xpath,  this , nsResolver,  0 ,  null );
                 var  found  =  [];
                 var  res;
                 while  (res  =  result.iterateNext())
                    found.push(res);
                 return  found;
            }
        }
        var  x  =  parseXML( " <people><person first-name=\"eric\"  middle-initial=\" H\"  last-name=\"jung\" ><address street=\ " 321  south st\ "  city=\ " denver\ "  state=\ " co\ "  country=\ " usa\ " />    <address street=\ " 123  main st\ "  city=\ " arlington\ "  state=\ " ma\ "  country=\ " usa\ " />  </person>  <person first-name=\ " jed\ "  last-name=\ " brown\ " >    <address street=\ " 321  north st\ "  city=\ " atlanta\ "  state=\ " ga\ "  country=\ " usa\ " />    <address street=\ " 123  west st\ "  city=\ " seattle\ "  state=\ " wa\ "  country=\ " usa\ " />    <address street=\ " 321  south avenue\ "  city=\ " denver\ "  state=\ " co\ "  country=\ " usa\ " />  </person></people> " );

        alert( " 搜索所有人的姓氏（last-name） " )
        var  results  =  x.selectNodes( " " );
        for  ( var  i = 0 ; i < results.length;i ++ )
          alert( " Person # "   +  i  +   "  has the last name  "   +  results[i].nodeValue);
        alert( " 搜索第二个人 " );
        //  IE是以0为下标基数的，而不是1 
        if ( ! document.all)
            results  =  x.selectSingleNode( " /people/person[2] " );
        else 
            results  =  x.selectSingleNode( " /people/person[1] " );
        alert(results.xml)

        alert( "获得住址在donver街上的人" );
        results  =  x.selectNodes( " //person[address/@city='denver'] " );
        for  ( var  i = 0 ; i < results.length;i ++ )alert(results[i].xml)

        if ( ! document.all){
             //  获得所有街名中带south的地址 
            results  =  x.selectNodes( " //address[contains(@street, 'south')] " );
            alert(results[ 0 ].xml);
        } else {
            alert( " IE不支持 //address[contains(@street, 'south')] 这种查询方式 ");

        }
    </script>
</head>
</html>
