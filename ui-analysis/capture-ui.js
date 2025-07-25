/**
 * Puppeteer UI Visual Analysis Script
 * Captures screenshots and analyzes lotus components
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureUIAnalysis() {
  console.log('🎯 Starting Visual UI Analysis...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Set desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    const testFilePath = `file://${__dirname}/../lotus-test.html`;
    console.log(`📱 Loading: ${testFilePath}`);
    
    await page.goto(testFilePath, { waitUntil: 'networkidle0' });
    
    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 1. Desktop Full Page Screenshot
    console.log('📸 Capturing desktop full page...');
    await page.screenshot({
      path: path.join(__dirname, 'desktop-full.png'),
      fullPage: true
    });
    
    // 2. Hero Section Analysis
    console.log('🌸 Analyzing Hero Section...');
    const heroSection = await page.$('.hero');
    if (heroSection) {
      await heroSection.screenshot({
        path: path.join(__dirname, 'hero-section.png')
      });
    }
    
    // 3. Navigation Analysis
    console.log('🧭 Analyzing Navigation...');
    const navDemo = await page.$('.nav-demo');
    if (navDemo) {
      await navDemo.screenshot({
        path: path.join(__dirname, 'navigation.png')
      });
    }
    
    // 4. Component Gallery Analysis
    console.log('🎨 Analyzing Component Gallery...');
    const grid = await page.$('.grid');
    if (grid) {
      await grid.screenshot({
        path: path.join(__dirname, 'component-gallery.png')
      });
    }
    
    // 5. Individual Lotus Components
    const components = ['LotusBloom', 'LotusBud', 'LotusLeaf', 'LotusIcon'];
    for (let i = 0; i < components.length; i++) {
      const card = await page.$(`.card:nth-child(${i + 1})`);
      if (card) {
        await card.screenshot({
          path: path.join(__dirname, `${components[i].toLowerCase()}-component.png`)
        });
      }
    }
    
    // 6. Mobile Viewport Analysis
    console.log('📱 Switching to mobile viewport...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.screenshot({
      path: path.join(__dirname, 'mobile-full.png'),
      fullPage: true
    });
    
    // 7. Component Measurements
    console.log('📏 Measuring component dimensions...');
    const measurements = await page.evaluate(() => {
      const results = {};
      
      // Measure Hero LotusBloom
      const heroLotus = document.querySelector('.hero svg');
      if (heroLotus) {
        const rect = heroLotus.getBoundingClientRect();
        results.heroLotus = {
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      }
      
      // Measure Navigation LotusIcon
      const navLotus = document.querySelector('.nav-demo svg');
      if (navLotus) {
        const rect = navLotus.getBoundingClientRect();
        results.navLotus = {
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      }
      
      // Measure Gallery Components
      const galleryComponents = document.querySelectorAll('.card svg');
      results.galleryComponents = Array.from(galleryComponents).map((svg, index) => {
        const rect = svg.getBoundingClientRect();
        return {
          index,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      });
      
      return results;
    });
    
    // 8. Animation Analysis
    console.log('🎬 Analyzing animations...');
    const animationElements = await page.$$('.animate-pulse');
    const animationAnalysis = {
      count: animationElements.length,
      elements: []
    };
    
    for (let i = 0; i < animationElements.length; i++) {
      const element = animationElements[i];
      const isVisible = await element.isIntersectingViewport();
      animationAnalysis.elements.push({
        index: i,
        visible: isVisible,
        tagName: await element.evaluate(el => el.tagName)
      });
    }
    
    // 9. Color Analysis
    console.log('🎨 Analyzing color usage...');
    const colorAnalysis = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg');
      const colors = new Set();
      
      svgs.forEach(svg => {
        const strokeElements = svg.querySelectorAll('[stroke]');
        strokeElements.forEach(el => {
          const stroke = el.getAttribute('stroke');
          if (stroke && stroke !== 'none') {
            colors.add(stroke);
          }
        });
        
        const fillElements = svg.querySelectorAll('[fill]');
        fillElements.forEach(el => {
          const fill = el.getAttribute('fill');
          if (fill && fill !== 'none') {
            colors.add(fill);
          }
        });
      });
      
      return Array.from(colors);
    });
    
    // Generate Analysis Report
    const analysisReport = {
      timestamp: new Date().toISOString(),
      viewport: {
        desktop: { width: 1920, height: 1080 },
        mobile: { width: 375, height: 812 }
      },
      measurements,
      animations: animationAnalysis,
      colors: colorAnalysis,
      screenshots: [
        'desktop-full.png',
        'mobile-full.png',
        'hero-section.png',
        'navigation.png',
        'component-gallery.png',
        'lotusbloom-component.png',
        'lotusbud-component.png',
        'lotusleaf-component.png',
        'lotusicon-component.png'
      ]
    };
    
    // Save analysis report
    fs.writeFileSync(
      path.join(__dirname, 'visual-analysis-report.json'),
      JSON.stringify(analysisReport, null, 2)
    );
    
    console.log('✅ Visual Analysis Complete!');
    console.log(`📊 Report saved: ${path.join(__dirname, 'visual-analysis-report.json')}`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  } finally {
    await browser.close();
  }
}

// Run analysis
captureUIAnalysis().catch(console.error);