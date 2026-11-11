import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { questionId, question, answer, subject, grade } = await req.json();
    const cleanAnswer = answer || '';

    // 1. Database එකේ දැනටමත් මෙම ප්‍රශ්නයට AI සටහනක් තිබේදැයි බැලීම (Cache Check)
    if (questionId) {
      const { data: cachedQuestion } = await supabase
        .from('quiz_questions')
        .select('ai_short_note')
        .eq('id', questionId)
        .maybeSingle();

      if (cachedQuestion?.ai_short_note && cachedQuestion.ai_short_note.trim().length > 15) {
        return NextResponse.json({
          note: cachedQuestion.ai_short_note
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        note: `⚠️ .env.local එකේ GEMINI_API_KEY හමු නොවීය.`
      });
    }

    const prompt = `
ඔබ ශ්‍රී ලංකා පාසල් විෂය නිර්දේශයේ ප්‍රවීණ ගුරුවරයෙකි.
ශ්‍රේණිය: ${grade}
විෂය: ${subject}
ප්‍රශ්නය: "${question}"
නිවැරදි පිළිතුර: "${cleanAnswer}"

ඉහත ප්‍රශ්නය සහ පිළිතුර ඇසුරෙන් දරුවෙකුට විභාගයට මතක තබාගැනීමට පහත ආකෘතියට පමණක් ගැලපෙන පැහැදිලි කෙටි සටහනක් සිංහලෙන් ලියන්න.
කිසිදු හේතුවක් මත වාක්‍යයක් හෝ අකුරක් අතරමග නවත්වන්න එපා. සම්පූර්ණ කරුණු 3 සහ සාරාංශය අවසන් වන තෙක් සම්පූර්ණයෙන්ම ලියන්න.

පහත ආකෘතියට පමණක් පිළිතුරු සපයන්න:

💡 ${cleanAnswer}

කෙටි සටහන:
- මූලික හැඳින්වීම: (${cleanAnswer} යනු කුමක්දැයි පෙළපොතට අනුකූලව කෙටියෙන්)
- ප්‍රධාන ලක්ෂණය: (මෙහි ඇති සුවිශේෂීම විෂය කරුණ හෝ ක්‍රියාකාරීත්වය)
- විභාග කරුණ: (විභාගයට මතක තබාගත යුතු අතිරේක පෙළපොත් කරුණක්)

මතක තබාගන්න: ${cleanAnswer} = (කෙටි සාරාංශ වාක්‍යය)

උපදෙස්: කිසිදු පෙරවදනක් නොලියා කෙළින්ම මාතෘකාවෙන් ආරම්භ කරන්න.
    `;

    // Google AI Studio හි gemini-3.8-flash නිල Endpoint එක
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({
        note: `⚠️ දෝෂයකි: ${data?.error?.message || 'API සම්බන්ධතාවය පරීක්ෂා කරන්න.'}`
      });
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // 2. AI එකෙන් සාර්ථකව generate වූ සටහන Supabase Database එකේ Save කිරීම
    if (questionId && generatedText) {
      await supabase
        .from('quiz_questions')
        .update({ ai_short_note: generatedText })
        .eq('id', questionId);
    }

    return NextResponse.json({
      note: generatedText || `💡 ${cleanAnswer}\n\nනිවැරදි පිළිතුර: ${cleanAnswer}`
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({
      note: `⚠️ Server Error: ${error.message}`
    });
  }
}