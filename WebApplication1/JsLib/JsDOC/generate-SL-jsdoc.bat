rmdir .\core /s/q
mkdir .\core

java -jar .\jsdoc-toolkit\jsrun.jar .\jsdoc-toolkit\app\run.js -c=SL-doc-config.conf

pause//运行完毕按键再关闭控制台 
