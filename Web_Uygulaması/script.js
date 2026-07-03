const ALFA = "abcdefghijklmnopqrstuvwxyz";
const PI = {a:0.0817,b:0.0150,c:0.0278,d:0.0425,e:0.1270,f:0.0223,g:0.0202,h:0.0609,i:0.0697,j:0.0015,k:0.0077,l:0.0403,m:0.0241,n:0.0675,o:0.0751,p:0.0193,q:0.0010,r:0.0599,s:0.0633,t:0.0906,u:0.0276,v:0.0098,w:0.0236,x:0.0015,y:0.0197,z:0.0007};

const testCases = {
    1: { cipher: "jgnnqyqtnfb", key: 2, expected: "helloworld" },
    2: { 
        cipher: "FDHVDU FLSKHU LV HDVB WR EUHDN ZLWK IUHTXHQFB", 
        key: 3, 
        expected: "caesar cipher is easy to break with frequency" 
    },
    3: { cipher: "WKLV LV D WHVW PHVVDJH IRU FDHVDU FLSKHU", key: 3, expected: "this is a test message for caesar cipher" }
};

let charts = {}, currentQi = [], results = [], currentTestCase = null;

function switchPage(page) {
    document.getElementById('page-main').style.display = page === 'main' ? 'block' : 'none';
    document.getElementById('page-test').style.display = page === 'test' ? 'block' : 'none';
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.id.toLowerCase().includes(page)));
}

function loadTest(id) {
    currentTestCase = testCases[id];
    document.querySelectorAll('.test-option-btn').forEach(b => b.classList.toggle('active', b.id === 'btn-t' + id));
    document.getElementById('testInfoArea').style.display = 'block';
    document.getElementById('testOutputArea').style.display = 'none';
    document.getElementById('expCipher').innerText = currentTestCase.cipher;
    document.getElementById('expKey').innerText = currentTestCase.key;
    document.getElementById('expPlain').innerText = currentTestCase.expected;
}

function runAnalysis(mode) {
    const text = (mode === 'main') ? document.getElementById('mainInput').value : currentTestCase.cipher;
    if(!text) return;
    
    let counts = Array(26).fill(0), total = 0;
    for(let c of text.toLowerCase()) { let idx = ALFA.indexOf(c); if(idx !== -1) { counts[idx]++; total++; } }
    currentQi = counts.map(c => total > 0 ? c/total : 0);
    
    const canvasId = mode + 'Chart';
    if(charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(document.getElementById(canvasId).getContext('2d'), {
        type: 'bar',
        data: {
            labels: ALFA.toUpperCase().split(''),
            datasets: [
                { label: 'p_i (Std)', data: ALFA.split('').map(l => PI[l]), backgroundColor: 'rgba(56, 139, 253, 0.2)' },
                { label: 'q_i (Metin)', data: currentQi, backgroundColor: '#2ea043' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    results = [];
    for(let j = 0; j < 26; j++) {
        let score = 0;
        for(let i = 0; i < 26; i++) { score += PI[ALFA[i]] * currentQi[(i + j) % 26]; }
        let pText = "";
        for(let c of text) {
            let lower = c.toLowerCase(); let idx = ALFA.indexOf(lower);
            if(idx !== -1) {
                let decoded = ALFA[(idx - j + 26) % 26];
                pText += (c === lower) ? decoded : decoded.toUpperCase();
            } else pText += c;
        }
        results.push({j, score, diff: Math.abs(score - 0.065), pText});
    }
    
    const best = results.reduce((a, b) => a.diff < b.diff ? a : b);
    document.getElementById(mode + 'OutputArea').style.display = 'block';
    document.getElementById(mode + 'TableBody').innerHTML = results.map(r => `
        <tr class="${r.j === best.j ? 'best-row' : ''}">
            <td><b>${r.j}</b></td><td>${r.score.toFixed(6)}</td><td>${r.diff.toFixed(6)}</td>
            <td class="plaintext-cell" onclick="showFullText(${r.j})">${r.pText}</td>
            <td><button class="btn btn-action" style="padding:4px 8px; font-size:11px; margin:0;" onclick="showMath(${r.j})">Detay</button></td>
        </tr>`).join('');

    if(mode === 'main') {
        document.getElementById('mainFinalPanel').style.display = 'block';
        document.getElementById('mainFoundKey').innerText = `${best.j} (${ALFA[best.j].toUpperCase()})`;
        document.getElementById('mainFoundText').innerText = best.pText;
    } else {
        const panel = document.getElementById('testFinalPanel');
        const header = document.getElementById('testStatusHeader');
        panel.style.display = 'block';
        if(best.j === currentTestCase.key) {
            header.innerText = "✓ BAŞARILI: j=" + best.j + " Bulundu"; header.style.color = "var(--primary)";
            document.getElementById('failExplanation').style.display = 'none'; panel.classList.remove('fail-panel');
        } else {
            header.innerText = "✗ TEST BAŞARISIZ"; header.style.color = "var(--error)";
            document.getElementById('failExplanation').style.display = 'block'; panel.classList.add('fail-panel');
        }
        document.getElementById('testFoundText').innerText = best.pText;
    }
}

function showFullText(j) {
    const res = results.find(r => r.j === j);
    document.getElementById('fullPlaintext').innerText = res.pText;
    document.getElementById('textModal').style.display = 'block';
}

function showMath(j) {
    let html = "", total = 0;
    document.getElementById('modalSelectedJ').innerText = j;
    for(let i = 0; i < 26; i++) {
        let p = PI[ALFA[i]], 
            qIdx = (i + j) % 26, 
            q = currentQi[qIdx], 
            m = p * q; 
        
        total += m;
        html += `<tr>
            <td>${i} (<b>${ALFA[i].toUpperCase()}</b>)</td>
            <td>${p.toFixed(4)}</td>
            <td>${q.toFixed(4)} (<b>${ALFA[qIdx].toUpperCase()}</b>)</td>
            <td style="color:var(--secondary); font-weight:bold;">${m.toFixed(6)}</td>
        </tr>`;
    }
    document.getElementById('mathModalBody').innerHTML = html;
    document.getElementById('mathModalTotal').innerHTML = `I<sub>${j}</sub> = ${total.toFixed(6)}`;
    document.getElementById('mathModal').style.display = 'block';
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }