/**
 * QQ Music API - Cloudflare Workers 入口
 * 统一路由处理
 */

// 导入各个 API 模块
import * as credential from "./api/credential.js";
import * as refresh from "./api/refresh.js";
import * as search from "./api/search.js";
import * as songUrl from "./api/song/url.js";
import * as songDetail from "./api/song/detail.js";
import * as lyric from "./api/lyric.js";
import * as album from "./api/album.js";
import * as playlist from "./api/playlist.js";
import * as singer from "./api/singer.js";
import * as top from "./api/top.js";
import * as admin from "./admin.js";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * 路由表
 */
const routes = {
    "/api/credential": credential,
    "/api/refresh": refresh,
    "/api/search": search,
    "/api/song/url": songUrl,
    "/api/song/detail": songDetail,
    "/api/lyric": lyric,
    "/api/album": album,
    "/api/playlist": playlist,
    "/api/singer": singer,
    "/api/top": top,
    "/admin": admin,
};

// 首页 HTML (内联)
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QQ Music API</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,sans-serif;background:#1a1a1a;color:#e0e0e0;line-height:1.6}
        .c{max-width:800px;margin:0 auto;padding:40px 20px}
        h1{font-size:2rem;color:#fff;margin-bottom:8px}
        .s{color:#666;margin-bottom:40px}
        h2{font-size:1.1rem;color:#31c27c;margin:30px 0 15px;border-bottom:1px solid #333;padding-bottom:8px}
        .e{background:#222;border-radius:8px;padding:16px;margin-bottom:16px}
        .h{display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .m{background:#31c27c;color:#000;padding:2px 8px;border-radius:4px;font-size:.75rem;font-weight:600}
        .p{font-family:monospace;color:#4facfe}
        .d{color:#999;font-size:.9rem;margin-bottom:12px}
        table{width:100%;border-collapse:collapse;font-size:.85rem}
        th{text-align:left;color:#666;font-weight:500;padding:6px 0}
        td{padding:6px 0;border-top:1px solid #333}
        .pm{font-family:monospace;color:#f0a020}
        .r{color:#f44;font-size:.75rem}
        .ex{background:#181818;padding:10px;border-radius:4px;font-family:monospace;font-size:.85rem;color:#aaa;margin-top:10px}
        footer{margin-top:50px;text-align:center;color:#444;font-size:.85rem}
        a{color:#31c27c;text-decoration:none}
        .gh{position:fixed;top:20px;right:20px;z-index:100}
        .gh a{display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:rgba(255,255,255,0.1);border-radius:50%;transition:all .3s}
        .gh a:hover{background:#31c27c;transform:scale(1.1)}
        .gh svg{width:24px;height:24px;fill:#e0e0e0;transition:fill .3s}
        .gh a:hover svg{fill:#000}
    </style>
</head>
<body>
<div class="gh"><a href="https://github.com/tooplick/qq-music-api" target="_blank" title="GitHub"><svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></div>
<div class="c">
    <h1>QQ Music API</h1>
    <p class="s">基于 Cloudflare Workers + D1 的 QQ 音乐 API 服务</p>
    <h2>搜索</h2>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/search</span></div><p class="d">搜索歌曲、歌手、专辑或歌单</p><table><tr><th>参数</th><th>类型</th><th>说明</th></tr><tr><td><span class="pm">keyword</span><span class="r">*</span></td><td>string</td><td>搜索关键词</td></tr><tr><td><span class="pm">type</span></td><td>string</td><td>song/singer/album/playlist</td></tr><tr><td><span class="pm">num</span></td><td>int</td><td>返回数量</td></tr><tr><td><span class="pm">page</span></td><td>int</td><td>页码</td></tr></table><div class="ex">GET /api/search?keyword=周杰伦&type=song&num=20</div></div>
    <h2>歌曲</h2>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/song/url</span></div><p class="d">获取歌曲播放链接</p><table><tr><th>参数</th><th>类型</th><th>说明</th></tr><tr><td><span class="pm">mid</span><span class="r">*</span></td><td>string</td><td>歌曲MID，多个用逗号分隔</td></tr><tr><td><span class="pm">quality</span></td><td>string</td><td>128/320/flac</td></tr></table><div class="ex">GET /api/song/url?mid=0039MnYb0qxYhV&quality=320</div></div>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/song/detail</span></div><p class="d">获取歌曲详情</p><table><tr><th>参数</th><th>类型</th><th>说明</th></tr><tr><td><span class="pm">mid</span></td><td>string</td><td>歌曲MID</td></tr><tr><td><span class="pm">id</span></td><td>int</td><td>歌曲ID</td></tr></table><div class="ex">GET /api/song/detail?mid=0039MnYb0qxYhV</div></div>
    <h2>歌词</h2>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/lyric</span></div><p class="d">获取歌词(LRC/QRC自动解密)</p><table><tr><th>参数</th><th>类型</th><th>说明</th></tr><tr><td><span class="pm">mid</span></td><td>string</td><td>歌曲MID</td></tr><tr><td><span class="pm">id</span></td><td>int</td><td>歌曲ID</td></tr></table><div class="ex">GET /api/lyric?mid=0039MnYb0qxYhV</div></div>
    <h2>专辑/歌单/歌手</h2>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/album</span></div><p class="d">获取专辑详情</p><div class="ex">GET /api/album?mid=002fRO0N4FftzY</div></div>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/playlist</span></div><p class="d">获取歌单详情</p><div class="ex">GET /api/playlist?id=8052190267</div></div>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/singer</span></div><p class="d">获取歌手信息</p><div class="ex">GET /api/singer?mid=0025NhlN2yWrP4</div></div>
    <h2>排行榜</h2>
    <div class="e"><div class="h"><span class="m">GET</span><span class="p">/api/top</span></div><p class="d">获取排行榜列表或详情</p><div class="ex">GET /api/top</div><div class="ex">GET /api/top?id=4&num=50</div></div>
    <footer><a href="https://github.com/tooplick/qq-music-api">GitHub</a></footer>
</div>
</body>
</html>`;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // OPTIONS 预检
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 静态首页
        if (path === "/" || path === "/index.html") {
            return new Response(indexHtml, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    ...corsHeaders,
                },
            });
        }

        // API 路由
        const handler = routes[path];
        if (handler && handler.onRequest) {
            return handler.onRequest({ request, env, ctx });
        }

        // 404
        return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    },

    // Cron 定时任务
    async scheduled(event, env, ctx) {
        await refresh.onSchedule({ env, ctx });
    },
};
