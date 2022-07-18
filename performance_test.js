import puppeteer from 'puppeteer';
import chalk from 'chalk'

const perfObsRunner = () => {
  window.resourceList = [];
  new PerformanceObserver((list) => {
    list.getEntries().forEach((item) => {
      if (item.name.includes('.svg')) window.resourceList = [...window.resourceList, item.toJSON()]
    })
  }).observe({ type: 'resource', buffered: true });
}

const base = "testautomationu"
const site = "https://testautomationu.applitools.com/"

const obj_61 = []
const obj_62 = []
const obj_63 = []
const obj_64 = []
const obj_65 = []

const getResourceTiming = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(perfObsRunner);
  await page.goto(site, { waitUntil: 'networkidle0', timeout: 30000 });
  const resource = await page.evaluate(() => ({ resource: window.resourceList }))
  //console.log(resource.resource)
  for (var i = 0; i < resource.resource.length; i++) {
    var obj = resource.resource[i];
    if (obj.name.includes(`https://${base}.applitools.com/course61.svg`)) {
      obj_61.push(obj);
    }
    if (obj.name.match(/https:\/\/testautomationu.+62\.svg/)) {
      obj_62.push(obj);
    }
    if (obj.name.match(/https:\/\/testautomationu.+63\.svg/)) {
      obj_63.push(obj);
    }
    if (obj.name.includes(`https://${base}.applitools.com/course64.svg`)) {
      obj_64.push(obj);
    }
    if (obj.name.includes(`https://${base}.applitools.com/course65.svg`)) {
      obj_65.push(obj);
    }
  }

  await page.close();
  await browser.close();
}

const runTest = async _ => {
  console.log('Starting Profiler')

  for (let index = 0; index < 5 ; index++) {
    await getResourceTiming()
    console.log('Run ' + (index + 1) + ' completed.')
  }
  
  console.log('');
  console.log('----- Results -----');
  console.log('');
  console.log(chalk.green('obj_61 Response end times: ') + findAllByKey(obj_61, 'responseEnd'))
  console.log(chalk.green('Average obj_61 respose end time : ') + getAverage(obj_61, 'responseEnd'));
  console.log(chalk.green('obj_62 response end time : ') + findAllByKey(obj_62, 'responseEnd'))
  console.log(chalk.green('Average obj_62 response end time : ') + getAverage(obj_62, 'responseEnd'))

  if(obj_63.length > 0) {
    console.log(chalk.green('obj_63 response end time : ') + findAllByKey(obj_63, 'responseEnd'))
    console.log(chalk.green('Average obj_63 response end time : ') + getAverage(obj_63, 'responseEnd'))
  }
  
  if(obj_64.length > 0) {
    console.log(chalk.green('obj_64 response end time : ') + findAllByKey(obj_64, 'responseEnd'));
    console.log(chalk.green('Average obj_64 response end time : ') + getAverage(obj_64, 'responseEnd'));
  }
}

runTest()

function findAllByKey(obj, keyToFind) {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => (key === keyToFind)
      ? acc.concat(value)
      : (typeof value === 'object')
      ? acc.concat(findAllByKey(value, keyToFind))
      : acc
    , [])
}

function getAverage(obj, keyToFind) {
  const values = findAllByKey(obj, keyToFind)
  const summedValues = values.reduce(
    (previousValue, currentValue) => previousValue + currentValue, 0);
  return summedValues / values.length
}