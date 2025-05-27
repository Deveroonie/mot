export default function Ad() {
    const ads = [
      {src: "/_a/pb1.gif", url: "https://billing.pebblehost.com/aff.php?aff=3681"},
      {src: "/_a/pb2.gif", url: "https://billing.pebblehost.com/aff.php?aff=3681"},
      {src: "/_a/pb3.gif", url: "https://billing.pebblehost.com/aff.php?aff=3681"},
      {src: "/_a/rg1.gif", url: "https://regery.com/en?pr=hmuhlyc"},
      {src: "/_a/rg2.png", url: "https://regery.com/en?pr=hmuhlyc"},
      {src: "/_a/ho1.png", url: "https://hostinger.com?REFERRALCODE=Deveroonie"},
      {src: "/_a/ht1.gif", url: "https://hilltopads.com/?ref=320161"},
      {src: "/_a/ht2.gif", url: "https://hilltopads.com/?ref=320161"},
      {src: "/_a/ht3.gif", url: "https://hilltopads.com/?ref=320161"}

    ]

    let ad = ads[Math.floor(Math.random()*ads.length)];
    return <a href={ad.url} suppressHydrationWarning><div className="bg-gradient-to-br from-pink-400 to-purple-600 w-full flex items-center justify-center"><img src={ad.src} suppressHydrationWarning /></div></a>
}