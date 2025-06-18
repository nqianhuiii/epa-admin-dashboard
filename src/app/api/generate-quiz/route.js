// src/app/api/generate-quiz-ai/route.js
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

const systemPrompt = `
    Anda ialah pakar dalam subjek ASAS SAINS KOMPUTER Tingkatan 1 Malaysia. 
    Tugas anda adalah menghasilkan soalan kuiz berkualiti tinggi dalam Bahasa Melayu yang sesuai untuk pelajar Tingkatan 1.

    📘 Topik yang dibenarkan:
    - Bab 1: Konsep Asas Pemikiran Komputasional
    - Bab 2: Perwakilan Data
    - Bab 3: Algoritma 
    - Bab 4: Kod Arahan

    Format jawapan mesti dalam struktur JSON yang **tepat**, seperti berikut:

    {
    "title": "Tajuk Kuiz",
    "description": "Penerangan ringkas tentang kuiz",
    "questions": [
        {
        "question": "Soalan dalam Bahasa Melayu?",
        "options": [
            "A) Pilihan pertama",
            "B) Pilihan kedua",
            "C) Pilihan ketiga",
            "D) Pilihan keempat"
        ],
        "correctAnswer": 1, // Nombor indeks jawapan yang betul, bermula dari 0
        "explanation": "Penjelasan kenapa jawapan ini betul (dalam Bahasa Melayu)"
        }
    ]
    }

    PERATURAN WAJIB:
    1. Semua soalan dan jawapan **mesti dalam Bahasa Melayu**.
    2. Setiap soalan **mempunyai 4 pilihan jawapan sahaja**, bermula dengan A), B), C), D).
    3. 'correctAnswer' mestilah nombor indeks dari 0 hingga 3, **bukan huruf atau teks**.
    4. Hanya **satu jawapan yang betul** dibenarkan bagi setiap soalan.
    5. Soalan mestilah **sesuai untuk tahap pelajar Tingkatan 1** (13 tahun).
    6. Jika ada, 'explanation' perlu diberi secara ringkas dan padat dalam Bahasa Melayu.
    7. Elakkan menggunakan istilah teknikal yang terlalu kompleks atau di luar silibus Tingkatan 1.

    Contoh betul:
    "correctAnswer": 2 // Bermaksud jawapan betul ialah pilihan ketiga (C)
    `;


    let userPrompt = '';
    
    if (hasFile && fileContent) {
      userPrompt = `
        Berdasarkan kandungan fail "${fileName}" di bawah, cipta ${questionCount} soalan quiz untuk peringkat kesukaran ${difficulty}.

        KANDUNGAN FAIL:
        ${fileContent.substring(0, 3000)} ${fileContent.length > 3000 ? '...' : ''}

        Pastikan soalan yang dicipta:
        1. Berkaitan dengan ASAS Sains Computer Tingkatan 1
        2. Berdasarkan kandungan fail yang diberikan
        3. Sesuai untuk peringkat kesukaran ${difficulty}
        4. ${includeExplanations ? 'Disertakan dengan penjelasan untuk setiap jawapan' : 'Tanpa penjelasan'}

        Jika kandungan fail tidak berkaitan dengan ASAS Sains Computer, cipta soalan umum tentang ASAS Sains Computer sahaja.
        `;
            } else {
            userPrompt = `
        Cipta ${questionCount} soalan quiz tentang "${topic}" untuk peringkat kesukaran ${difficulty}.
        Pastikan semua soalan berkaitan dengan ASAS Sains Computer Tingkatan 1.

        Keperluan:
        1. Soalan mesti berkaitan dengan "${topic}" dalam konteks ASAS Sains Computer
        2. Peringkat kesukaran: ${difficulty}
        3. ${includeExplanations ? 'Disertakan dengan penjelasan untuk setiap jawapan' : 'Tanpa penjelasan'}
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
      max_tokens: 3000,
    });

    // Parse the AI response
    const aiResponse = response.choices[0].message.content;
    
    let quizData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response',
          details: 'AI returned invalid format',
          rawResponse: aiResponse 
        },
        { status: 500 }
      );
    }

    // Validate the structure of the response
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return NextResponse.json(
        { error: 'Invalid quiz structure from AI' },
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
        correctAnswer: q.correctAnswer || 'A',
        explanation: includeExplanations ? (q.explanation || '') : ''
      };
    });

    // Return the generated quiz
    return NextResponse.json({
      success: true,
      data: {
        title: quizData.title || `Quiz ${hasFile ? 'berdasarkan ' + fileName : 'tentang ' + topic}`,
        description: quizData.description || `Quiz yang dijana AI ${hasFile ? 'berdasarkan kandungan fail' : 'tentang ' + topic}`,
        questions: validatedQuestions
      },
      usage: response.usage,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: hasFile ? 'file' : 'topic',
        difficulty: difficulty,
        questionCount: validatedQuestions.length
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