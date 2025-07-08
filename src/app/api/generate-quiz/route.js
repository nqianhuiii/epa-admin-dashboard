import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { 
      questionCount, 
      difficulty, 
      topic, 
      includeExplanations,
      fileContent,
      hasFile,
      fileName 
    } = await request.json();

    // Validate input
    if (!hasFile && !topic) {
      return NextResponse.json(
        { error: 'Please provide either a file or a topic' }, 
        { status: 400 }
      );
    }

    // Validate question count
    if (questionCount < 1 || questionCount > 20) {
      return NextResponse.json(
        { error: 'Question count must be between 1 and 20' }, 
        { status: 400 }
      );
    }

    // PRE-VALIDATE FILE CONTENT BEFORE SENDING TO AI
    if (hasFile && fileContent) {
      const isRelevant = validateFileRelevance(fileContent);
      console.log('📋 File relevance check:', isRelevant);
      
      if (!isRelevant) {
        return NextResponse.json({
          error: 'FAIL_NOT_RELEVANT',
          message: 'Kandungan fail yang dimuat naik tidak berkaitan dengan silibus Asas Sains Komputer Tingkatan 1. Sila muat naik fail yang mengandungi kandungan berkaitan dengan: Pemikiran Komputasional, Perwakilan Data, Algoritma, atau Kod Arahan.',
          details: 'File content validation failed'
        }, { status: 422 });
      }
    }

    const systemPrompt = `
        Anda ialah pakar dalam subjek ASAS SAINS KOMPUTER Tingkatan 1 Malaysia. 
        Tugas anda adalah menghasilkan soalan kuiz berkualiti tinggi dalam Bahasa Melayu yang sesuai untuk pelajar Tingkatan 1.

        KANDUNGAN SILUBUS LENGKAP ASAS SAINS KOMPUTER TINGKATAN 1:
        BAB 1: KONSEP ASAS PEMIKIRAN KOMPUTASIONAL
        BAB 2: PERWAKILAN DATA
        BAB 3: ALGORITMA
        BAB 4: KOD ARAHAN

        NOTA PENTING: Kandungan yang diberikan telah disahkan berkaitan dengan silibus. 
        Anda TIDAK perlu melakukan validasi kandungan lagi. Teruskan dengan menjana soalan.

        Format jawapan mesti dalam struktur JSON yang tepat:
        {
            "title": "Tajuk yang spesifik berdasarkan kandungan",
            "description": "Penerangan yang jelas tentang quiz ini",
            "questions": [
                {
                    "question": "Soalan dalam Bahasa Melayu?",
                    "options": [
                        "A) Pilihan pertama",
                        "B) Pilihan kedua", 
                        "C) Pilihan ketiga",
                        "D) Pilihan keempat"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Penjelasan kenapa jawapan ini betul"
                }
            ]
        }

        PERATURAN WAJIB:
        1. Semua soalan dan jawapan mesti dalam Bahasa Melayu
        2. Setiap soalan mempunyai 4 pilihan jawapan (A, B, C, D)
        3. 'correctAnswer' mestilah nombor indeks dari 0 hingga 3
        4. Hanya satu jawapan yang betul bagi setiap soalan
        5. Soalan mestilah sesuai untuk tahap pelajar Tingkatan 1
        6. Jika diminta, 'explanation' perlu diberi dalam Bahasa Melayu
        7. Fokus pada kandungan yang diberikan
        `;
        
    let userPrompt = '';

    if (hasFile && fileContent) {
      const fileExtension = fileName ? fileName.split('.').pop()?.toLowerCase() : '';
      
      userPrompt = `
        Berdasarkan kandungan fail berikut, cipta ${questionCount} soalan quiz untuk peringkat kesukaran ${difficulty}.
        
        Nama fail: "${fileName}"
        Topik fokus: "${topic || 'Berdasarkan kandungan fail'}"
        
        Kandungan fail:
        ${fileContent.substring(0, 8000)}${fileContent.length > 8000 ? '\n[...kandungan dipotong kerana terlalu panjang...]' : ''}

        Keperluan:
        1. Jana ${questionCount} soalan berdasarkan kandungan fail di atas
        2. Peringkat kesukaran: ${difficulty}
        3. Fokus pada topik yang berkaitan dengan Asas Sains Komputer${topic ? ` terutamanya "${topic}"` : ''}
        4. ${includeExplanations ? 'Sertakan penjelasan untuk setiap jawapan' : 'Tanpa penjelasan'}
        5. Pastikan soalan mencerminkan kandungan sebenar fail
        `;
    } else {
      userPrompt = `
        Cipta ${questionCount} soalan quiz tentang "${topic}" untuk peringkat kesukaran ${difficulty}.
        
        Keperluan:
        1. Soalan berkaitan dengan "${topic}" dalam konteks Asas Sains Komputer Tingkatan 1
        2. Peringkat kesukaran: ${difficulty}
        3. ${includeExplanations ? 'Sertakan penjelasan untuk setiap jawapan' : 'Tanpa penjelasan'}
        4. Sesuai untuk pelajar Tingkatan 1
        `;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 15000, // Increased token limit
    });

    const aiResponse = response.choices[0].message.content;
    console.log('🤖 Raw AI Response:', aiResponse);
    
    let quizData;
    try {
      // More robust JSON extraction
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        // Try to find JSON in code blocks
        const codeBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          quizData = JSON.parse(codeBlockMatch[1]);
        } else {
          throw new Error('No JSON found in response');
        }
      }
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);
      console.error('❌ Raw response:', aiResponse);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response',
          details: 'AI returned invalid JSON format',
          rawResponse: aiResponse.substring(0, 500) + '...' // Truncate for logging
        },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return NextResponse.json(
        { 
          error: 'Invalid quiz structure from AI',
          details: 'Missing questions array'
        },
        { status: 500 }
      );
    }

    // Ensure all questions have required fields
    const validatedQuestions = quizData.questions.map((q, index) => {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} has invalid structure`);
      }
      
      return {
        question: q.question,
        options: q.options,
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: includeExplanations ? (q.explanation || '') : ''
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        title: quizData.title || `Quiz ${hasFile ? 'berdasarkan ' + fileName : 'tentang ' + topic}`,
        description: quizData.description || `Quiz yang dijana berdasarkan ${hasFile ? 'kandungan fail' : 'topik ' + topic}`,
        questions: validatedQuestions
      },
      usage: response.usage,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: hasFile ? 'file' : 'topic',
        difficulty: difficulty,
        questionCount: validatedQuestions.length,
        fileName: hasFile ? fileName : null,
        contentLength: hasFile ? fileContent.length : 0
      }
    });

  } catch (error) {
    console.error('AI Quiz Generation Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate quiz',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Enhanced file relevance validation
// function validateFileRelevance(fileContent) {
//   if (!fileContent || typeof fileContent !== 'string') {
//     return false;
//   }

//   const contentLower = fileContent.toLowerCase();
  
//   // Computer Science keywords (expanded list)
//   const computerScienceKeywords = [
//     // English terms
//     'algorithm', 'pseudocode', 'flowchart', 'computational thinking', 'computational',
//     'binary', 'decimal', 'html', 'programming', 'code', 'javascript', 'python',
//     'data', 'digital', 'bit', 'byte', 'resolution', 'quality', 'pixel',
//     'file size', 'format', 'variable', 'operator', 'loop', 'condition',
//     'if', 'else', 'while', 'for', 'function', 'array', 'string', 'integer',
//     'input', 'output', 'tag', 'element', 'attribute', 'css', 'web', 'website',
//     'software', 'hardware', 'computer', 'technology', 'coding', 'script',
//     'database', 'server', 'client', 'network', 'internet', 'cyber',
    
//     // Malay terms
//     'algoritma', 'pseudokod', 'carta alir', 'pemikiran komputasional',
//     'sistem nombor', 'perduaan', 'perpuluhan', 'pengaturcaraan', 'aturcara',
//     'kod', 'program', 'data', 'imej digital', 'audio digital', 'digital',
//     'resolusi', 'kualiti', 'saiz fail', 'format fail', 'pembolehubah', 'pemboleh ubah',
//     'operator', 'ulangan', 'pilihan', 'kawalan', 'struktur', 'komputer',
//     'pautan', 'laman web', 'sesawang', 'tag', 'elemen', 'atribut',
//     'banner', 'frame', 'menu', 'komen', 'ralat', 'keputusan', 'teknologi',
//     'corak', 'leraian', 'tertib', 'permasalahan', 'teknik', 'sains komputer',
//     'pengekodan', 'aksara', 'ukuran', 'kedalaman', 'warna', 'piksel',
//     'terabait', 'megabait', 'gigabait', 'kilobait', 'bait', 'tb', 'mb', 'gb', 'kb',
//     'pembangunan', 'pengesanan', 'penghasilan', 'gabungan', 'perisian',
//     'papan cerita', 'interaktif', 'arahan', 'perkakasan', 'rangkaian',
//     'internet', 'siber', 'pangkalan data', 'pelayan', 'klien'
//   ];
  
//   // Check for keyword presence (need at least 3 matches for higher confidence)
//   const keywordMatches = computerScienceKeywords.filter(keyword => 
//     contentLower.includes(keyword)
//   ).length;
  
//   // Code patterns (more comprehensive)
//   const codePatterns = [
//     /\b(if|else|while|for|function|var|let|const|return|class|def|import|export)\b/gi,
//     /<[^>]+>/g, // HTML tags
//     /\{[\s\S]*?\}/g, // Code blocks
//     /\d+\s*[+\-*/=]\s*\d+/g, // Mathematical expressions
//     /\b\d+\s*(bit|byte|kb|mb|gb|tb|bait|kilobait|megabait|gigabait|terabait)\b/gi,
//     /\b(true|false|null|undefined|benar|salah|kosong)\b/gi,
//     /\b0b[01]+\b/gi, // Binary numbers
//     /\b0x[0-9a-f]+\b/gi, // Hexadecimal numbers
//     /\b\d+\.\d+\.\d+\.\d+\b/gi, // IP addresses
//     /\b[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[^;]+/gi, // Variable assignments
//     /\/\*[\s\S]*?\*\/|\/\/.*$/gm, // Comments
//     /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/gi, // SQL keywords
//     /\b(print|console\.log|echo|printf)\b/gi, // Output commands
//   ];
  
//   const hasCodePatterns = codePatterns.some(pattern => pattern.test(fileContent));
  
//   // Computer science concepts patterns
//   const conceptPatterns = [
//     /\b(sort|search|linear|binary|bubble|merge|quick)\b/gi,
//     /\b(array|list|stack|queue|tree|graph|node)\b/gi,
//     /\b(recursive|iteration|loop|condition|branch)\b/gi,
//     /\b(input|output|process|storage|memory)\b/gi,
//     /\b(encrypt|decrypt|hash|security|password)\b/gi,
//   ];
  
//   const hasConceptPatterns = conceptPatterns.some(pattern => pattern.test(fileContent));
  
//   // File extension or format indicators
//   const formatIndicators = [
//     /\.(html|css|js|py|java|cpp|c|php|sql|json|xml)/gi,
//     /\b(jpg|jpeg|png|gif|pdf|doc|docx|txt|mp3|wav|mp4|avi)\b/gi,
//   ];
  
//   const hasFormatIndicators = formatIndicators.some(pattern => pattern.test(fileContent));
  
//   // Scoring system for better accuracy
//   let relevanceScore = 0;
//   relevanceScore += keywordMatches;
//   relevanceScore += hasCodePatterns ? 10 : 0;
//   relevanceScore += hasConceptPatterns ? 5 : 0;
//   relevanceScore += hasFormatIndicators ? 3 : 0;
  
//   // Content length consideration (very short content is less likely to be relevant)
//   if (fileContent.length < 100) {
//     relevanceScore *= 0.5;
//   }
  
//   console.log('📊 Relevance scoring:', {
//     keywordMatches,
//     hasCodePatterns,
//     hasConceptPatterns,
//     hasFormatIndicators,
//     contentLength: fileContent.length,
//     totalScore: relevanceScore
//   });
  
//   // Threshold for relevance (adjust as needed)
//   return relevanceScore >= 4;
// }

function validateFileRelevance(fileContent) {
  if (!fileContent || typeof fileContent !== 'string') {
    return false;
  }

  const contentLower = fileContent.toLowerCase();
  const computerScienceKeywords = [
    // English terms
    'algorithm', 'pseudocode', 'flowchart', 'computational thinking', 'computational',
    'binary', 'decimal', 'html', 'programming', 'code', 'javascript', 'python',
    'data', 'digital', 'bit', 'byte', 'resolution', 'quality', 'pixel',
    'file size', 'format', 'variable', 'operator', 'loop', 'condition',
    'if', 'else', 'while', 'for', 'function', 'array', 'string', 'integer',
    'input', 'output', 'tag', 'element', 'attribute', 'css', 'web', 'website',
    'software', 'hardware', 'computer', 'technology', 'coding', 'script',
    'database', 'server', 'client', 'network', 'internet', 'cyber',
    
    // Malay terms
    'algoritma', 'pseudokod', 'carta alir', 'pemikiran komputasional',
    'sistem nombor', 'perduaan', 'perpuluhan', 'pengaturcaraan', 'aturcara',
    'kod', 'program', 'data', 'imej digital', 'audio digital', 'digital',
    'resolusi', 'kualiti', 'saiz fail', 'format fail', 'pembolehubah', 'pemboleh ubah',
    'operator', 'ulangan', 'pilihan', 'kawalan', 'struktur', 'komputer',
    'pautan', 'laman web', 'sesawang', 'tag', 'elemen', 'atribut',
    'banner', 'frame', 'menu', 'komen', 'ralat', 'keputusan', 'teknologi',
    'corak', 'leraian', 'tertib', 'permasalahan', 'teknik', 'sains komputer',
    'pengekodan', 'aksara', 'ukuran', 'kedalaman', 'warna', 'piksel',
    'terabait', 'megabait', 'gigabait', 'kilobait', 'bait', 'tb', 'mb', 'gb', 'kb',
    'pembangunan', 'pengesanan', 'penghasilan', 'gabungan', 'perisian',
    'papan cerita', 'interaktif', 'arahan', 'perkakasan', 'rangkaian',
    'internet', 'siber', 'pangkalan data', 'pelayan', 'klien'
  ];
  
   const keywordMatches = computerScienceKeywords.filter(keyword => 
    contentLower.includes(keyword)
  ).length;
  
  // Code patterns (more comprehensive)
  const codePatterns = [
    /\b(if|else|while|for|function|var|let|const|return|class|def|import|export)\b/gi,
    /<[^>]+>/g, // HTML tags
    /\{[\s\S]*?\}/g, // Code blocks
    /\d+\s*[+\-*/=]\s*\d+/g, // Mathematical expressions
    /\b\d+\s*(bit|byte|kb|mb|gb|tb|bait|kilobait|megabait|gigabait|terabait)\b/gi,
    /\b(true|false|null|undefined|benar|salah|kosong)\b/gi,
    /\b0b[01]+\b/gi, // Binary numbers
    /\b0x[0-9a-f]+\b/gi, // Hexadecimal numbers
    /\b\d+\.\d+\.\d+\.\d+\b/gi, // IP addresses
    /\b[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[^;]+/gi, // Variable assignments
    /\/\*[\s\S]*?\*\/|\/\/.*$/gm, // Comments
    /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/gi, // SQL keywords
    /\b(print|console\.log|echo|printf)\b/gi, // Output commands
  ];
  
  const hasCodePatterns = codePatterns.some(pattern => pattern.test(fileContent));
  // File extension or format indicators
  const formatIndicators = [
    /\.(html|css|js|py|java|cpp|c|php|sql|json|xml)/gi,
    /\b(jpg|jpeg|png|gif|pdf|doc|docx|txt|mp3|wav|mp4|avi)\b/gi,
  ];
  
  const hasFormatIndicators = formatIndicators.some(pattern => pattern.test(fileContent));
  

  let relevanceScore = 0;
  if (keywordMatches >= 1) relevanceScore += 2;
  if (keywordMatches >= 4) relevanceScore += 2;

  relevanceScore += hasCodePatterns ? 8 : 0;
  relevanceScore += hasFormatIndicators ? 2 : 0;

    
  console.log('📊 Relevance scoring:', {
    keywordMatches,
    hasCodePatterns,
    hasFormatIndicators,
    contentLength: fileContent.length,
    totalScore: relevanceScore
  });

  // Remove content length penalty OR soften it
  if (fileContent.length < 100) {
    relevanceScore += 2; // Bonus instead of penalty
  }

  return relevanceScore >= 3; // Reduced threshold
}
