var fs = require('fs');
var blacklist = {
    'static': 1,
    'test': 1,
    'game': 1,
    'common': 1,
    'static_store':1,
    'static_webim':1,
    'static_wx':1
}
var versions=[
    {
        name:'v1版本目录',
        la:-1,
        list:[]
    },
    {
        name:'v2版本目录', // 目录名称
        la:1, // 所在层级
        list:['v2'] // 当前层所属目录
    },
    {
        name:'微信版本目录',
        la:1,
        list:['wx']
    },
    {
        name:'商铺',
        la:1,
        list:['store']
    },
    {
        name:'哞哞',
        la:1,
        list:['webim']
    },
    {
        name:'其他杂七杂八',
        la:1,
        list:['api']
    }
];
// var i = 1;
// fs.writeFile('./_index/p.json',"{\r",function(err){
//   if(err) throw err;
// });
// fs.writeFile('./_index/f.json',"[\r",function(err){
//   if(err) throw err;
// });

// var layer=1;
function walk2(path, item, pt,la) {
    pt = pt || ".";
    var _list={
            name: item || '',
            url: pt,
            la:la,
            plist:[],
            svn:[]
        };
    // i++;
    files = fs.readdirSync(path);
    files.forEach(function(item) {
        var tmpPath = path + '/' + item,
            stats = fs.statSync(tmpPath);
        if(item.slice(0, 1) != '_'){
            if (stats.isDirectory()) {
                if (!blacklist[item] ) {
                    _list.plist.push(walk2(tmpPath, item, pt + "/" + item,la+1));
                }
            } else {
                if (item.indexOf(".html") > -1) {
                    var data = fs.readFileSync(tmpPath, {
                        encoding: "utf-8"
                    });
                    var _title = data.match(/<title>(.+)<\/title>/);
                    if (_title != null) {
                        _list.svn.push({
                            title: _title[1],
                            url: pt + "/" + item,
                            name: item,
                        });
                    }
                }
            }
        }
    });
    return _list
};
var list={};
versions.forEach(function(item){
    list[item.name]=[];
});
function walk3(data){
    var i=0;
    while (i<data.plist.length){
        var item=data.plist[i];
        var bol=true;
        versions.forEach(function(v){
            if(v.la==item.la){
                v['list'].forEach(function(v2){
                    if(v2==item.name){
                        list[v.name].push(item);
                        data.plist.splice(i,1);
                        bol=false
                        return false;
                    }
                });
            }
        });
        if(bol){
            item=walk3(item);
            i++;
        }
    }
    return data;
    // data.plist.forEach(function(item){
    //     var bol=true;
        
    // });
}

var list_all=walk2(process.cwd(), 'v1版本根目录','',0);
// list[versions[0].name]=//.push(item);
list[versions[0].name].push(walk3(list_all))

fs.writeFile('./_index/pp.json',JSON.stringify(list),function(err){
  if(err) throw err;
});

// 默认任务
//gulp.task('default',['lint', 'less', 'scripts']);