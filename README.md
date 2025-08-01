# 🎓 xAPI Learning Experience Platform

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![xAPI](https://img.shields.io/badge/xAPI-1.0.3-blue.svg)](https://xapi.com/)
[![HTML5](https://img.shields.io/badge/HTML5-5-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-3-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Modern e-learning system** developed with **xAPI (Experience API)** for detailed tracking of learning experiences. Demonstration of scalable architecture and advanced analytics for corporate education.

## 📋 About the Project

This project demonstrates the **migration from SCORM to xAPI** in a corporate communication course, implementing **granular tracking** and **advanced analytics**. Developed as a proof of concept to modernize e-learning systems.

### 🎯 Technical Objectives

- ✅ **Implement complete xAPI 1.0.3 specification**
- ✅ **Modular and scalable architecture**
- ✅ **Responsive interface** with modern UX
- ✅ **Real-time analytics system**
- ✅ **Universal compatibility** with LMS
- ✅ **Mobile-optimized performance**

## 🛠️ Technologies Used

### **Frontend**
- **JavaScript ES6+** - Application logic and xAPI
- **HTML5** - Semantic structure
- **CSS3** - Responsive design and animations
- **LocalStorage API** - Data persistence

### **xAPI & Analytics**
- **Experience API 1.0.3** - Learning tracking
- **Learning Record Store (LRS)** - Data storage
- **Real-time Analytics** - Live dashboard
- **Statement Tracking** - Every interaction recorded

### **Architecture**
- **MVC Pattern** - Separation of concerns
- **Event Delegation** - Optimized performance
- **Observer Pattern** - Module communication
- **Factory Pattern** - Statement creation

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│           Interface (HTML)          │
├─────────────────────────────────────┤
│         Controller (app.js)         │
├─────────────────────────────────────┤
│         xAPI Layer (xapi.js)       │
├─────────────────────────────────────┤
│      Storage (localStorage/LRS)     │
└─────────────────────────────────────┘
```

### **Main Components**

#### **1. XAPI Class (`src/js/xapi.js`)**
- **Auto-initialization** and endpoint detection
- **Fallback system** for standalone mode
- **Standardized statements** according to specification
- **LRS communication** via HTTP/REST

#### **2. XAPIApp Class (`src/js/app.js`)**
- **Application state management**
- **Lesson navigation system**
- **User interaction processing**
- **Real-time feedback**

#### **3. Responsive Interface (`src/styles/main.css`)**
- **Design system** with CSS custom properties
- **Responsive grid layout**
- **Optimized CSS animations**
- **Mobile-first approach**

## 📊 Implemented Features

### **🎯 Granular Tracking**
- **Navigation** - Every lesson access recorded
- **Reflections** - User reflection content
- **Quiz** - Individual responses with feedback
- **Scenarios** - Choices in practical situations
- **Assessment** - Final results with scoring

### **📈 Real-time Analytics**
- **Dashboard** with live metrics
- **Visual progress** with progress bar
- **xAPI statement log**
- **Performance reports**

### **🎨 Modern Interface**
- **Responsive design** for all devices
- **Immediate visual feedback**
- **Smooth animations** and transitions
- **Learning-optimized UX**

## 🔧 How to Run

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/poc-xapi.git
cd poc-xapi
```

### **2. Run Locally**
```bash
# Open main file
open index.html

# Or use a local server
python -m http.server 8000
# Access: http://localhost:8000
```

### **3. Test Simulation**
```bash
# Open xAPI player simulation
open docs/xapi-player-simulation.html
```

## 📁 Project Structure

```
poc-xapi/
├── 📄 index.html                    # Main application
├── 📁 src/
│   ├── 📁 js/
│   │   ├── 🧠 app.js               # Application controller
│   │   └── 🔌 xapi.js              # xAPI implementation
│   └── 📁 styles/
│       └── 🎨 main.css             # Responsive styles
├── 📁 docs/
│   ├── 📊 xapi-player-simulation.html  # Player simulation
│   └── 📋 scorm-vs-xapi-comparison.md  # Technical comparison
├── 📁 scripts/
│   └── 🔧 build.sh                 # Build script
└── 📄 README.md                    # Documentation
```

## 🚀 Technical Demonstration

### **Implemented xAPI Statements**

#### **1. Initialization**
```json
{
  "actor": {"objectType": "Agent", "name": "User", "mbox": "mailto:..."},
  "verb": {"id": "http://adlnet.gov/expapi/verbs/initialized", "display": {"en-US": "initialized"}},
  "object": {"id": "http://example.com/effective-communication", "definition": {...}}
}
```

#### **2. Lesson Navigation**
```json
{
  "verb": {"id": "http://adlnet.gov/expapi/verbs/accessed", "display": {"en-US": "accessed"}},
  "object": {"id": "http://example.com/effective-communication/lesson/1", "definition": {...}}
}
```

#### **3. User Interactions**
```json
{
  "verb": {"id": "http://adlnet.gov/expapi/verbs/answered", "display": {"en-US": "answered"}},
  "result": {"response": "written", "success": true, "score": {"raw": 100, "min": 0, "max": 100}}
}
```

### **Fallback System**
```javascript
// Local storage when LRS not available
storeLocally(statement) {
    const statements = JSON.parse(localStorage.getItem('xapi_statements') || '[]');
    statements.push({...statement, timestamp: new Date().toISOString()});
    localStorage.setItem('xapi_statements', JSON.stringify(statements));
}
```

## 📚 Resources and References

- **[xAPI Specification](https://xapi.com/)** - Official documentation
- **[ADL xAPI Spec](https://github.com/adlnet/xAPI-Spec)** - Technical specification
- **[Learning Analytics](https://www.adlnet.gov/adl-research/performance-tracking-analysis/experience-api/)** - Analytics guide
- **[LRS Implementations](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#lrs-requirements)** - LRS list