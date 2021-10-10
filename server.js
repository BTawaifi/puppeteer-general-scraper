const puppeteer = require('puppeteer');
const fs = require("fs");
const express = require('express');
const app = express();
app.use(express.static('public'));

const mock={
  "outer": [
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/09/Gas-Station-Simulator-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/gas-station-simulator-v1-01-38259-goldberg/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/10/Shelter-Manager-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/shelter-manager-early-access/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/09/Pathfinder-Wrath-of-the-Righteous-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/pathfinder-wrath-of-the-righteous-v1-0-8e-gog/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/10/Stonedeep-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/stonedeep-plaza/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/10/Seduction-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/seduction-darksiders/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/10/Castle-in-The-Clouds-DX-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/castle-in-the-clouds-dx-darksiders/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2020/03/Mount-and-Blade-II-Bannerlord-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/mount-and-blade-ii-bannerlord-e1-6-3-early-access/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/09/Life-is-Strange-True-Colors-pc-free-download.jpg",
      "link": "https://www.skidrowreloaded.com/life-is-strange-true-colors-v1-1-192-628695-p2p/"
    },
    {
      "pic": "https://www.skidrowreloaded.com/wp-content/uploads/2021/08/The-Ascent-download-pc-free.jpg",
      "link": "https://www.skidrowreloaded.com/the-ascent-v07-10-2021-goldberg/"
    }
  ]
}

function wait (ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function lazyScrollSolver(page) {
  try {

  // Get the height of the rendered page
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate(_viewportHeight => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(20);
    viewportIncr = viewportIncr + viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(_ => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(100);
} catch (error) {
    console.log(error);
}
}

(async () => {

    //clear
    await fs.writeFile(
        `./public/GameList.json`,
        'outer=',
        (err) => {
          if (err) res.send(err)
        }
      );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  
  for (let index = 1; index <= 1; index++) {
    await page.goto(`https://www.skidrowreloaded.com/page/${index}`,{waitUntil: 'load'});
    await lazyScrollSolver(page)
 
      const evl=await page.evaluate(()=>{
        let outer=[];
        document.querySelectorAll('.post-excerpt').forEach(element=>{
            outer.push({
              pic:element.childNodes[2].firstChild.firstChild.src,
              link:element.childNodes[2].firstChild.href
            }
          )
        })
        return{outer}
      })
      
      await console.log(evl);
      await fs.appendFile(`./public/GameList.json`,JSON.stringify(evl, null, 2),(err) => {
          if (err) {
            console.log(err)
            fs.appendFile(`./public/GameList.json`,JSON.stringify(mock, null, 2))
          };
        }
      );
  }

  debugger;
  await browser.close();
})();


  //https://expressjs.com/en/starter/examples.html reference

  app.listen(5000,()=>console.log("Listening on port 5000"))