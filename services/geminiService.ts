
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

export async function analyzeFoodImage(
  base64Image: string, 
  additionalContext: string,
  modelName: string = "gemini-3-pro-preview"
): Promise<{
  items: Omit<FoodItem, 'id' | 'consumedPercentage'>[];
  description: string;
  insight: string;
}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    请作为专业的营养师分析这张食物图片。
    1. 识别图中所有不同的食物单品。
    2. 估算每种食物的重量（克）和详细营养成分。
    3. description: 提供这顿饭的简短中文描述。
    4. insight: 提供一个“洞察”建议：基于该餐营养成分的一句话健康建议（例如：“蛋白质含量高，适合肌肉恢复”或“建议加点绿叶菜以平衡碳水”）。
    
    ${additionalContext ? `用户补充背景信息: "${additionalContext}"。请根据此信息调整对隐形成分或烹饪方式的判断。` : ''}

    重要：请务必使用**简体中文**返回所有文本内容（包括 name, description, insight）。
    请严格按照指定的 JSON 格式返回数据。
  `;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(',')[1] || base64Image
    }
  };
  
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "食物名称，使用简体中文" },
                  estimatedWeightGrams: { type: Type.NUMBER },
                  nutrients: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                      fiber: { type: Type.NUMBER },
                      sugar: { type: Type.NUMBER }
                    },
                    required: ["calories", "protein", "carbs", "fat", "fiber", "sugar"]
                  }
                },
                required: ["name", "estimatedWeightGrams", "nutrients"]
              }
            },
            description: { type: Type.STRING, description: "餐食描述，使用简体中文" },
            insight: { type: Type.STRING, description: "健康建议，使用简体中文" }
          },
          required: ["items", "description", "insight"]
        }
      }
    });

    let jsonStr = response.text;
    
    if (!jsonStr) {
      throw new Error("AI 返回了空响应，请检查图片或稍后重试。");
    }

    // Clean markdown code blocks if present (common issue causing parse errors)
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON:", jsonStr);
      throw new Error("AI 数据解析失败，请重试。");
    }

    // Strict validation and sanitization to prevent crashes
    const validItems = Array.isArray(parsed.items) ? parsed.items.map((item: any) => {
      // Ensure nutrients object exists with safe defaults
      const nutrients = {
        calories: Number(item?.nutrients?.calories) || 0,
        protein: Number(item?.nutrients?.protein) || 0,
        carbs: Number(item?.nutrients?.carbs) || 0,
        fat: Number(item?.nutrients?.fat) || 0,
        fiber: Number(item?.nutrients?.fiber) || 0,
        sugar: Number(item?.nutrients?.sugar) || 0,
      };

      return {
        name: String(item?.name || "未知食物"),
        estimatedWeightGrams: Number(item?.estimatedWeightGrams) || 0,
        originalWeightGrams: Number(item?.estimatedWeightGrams) || 0, // Ensure originalWeightGrams matches estimated initially
        nutrients
      };
    }) : [];

    return { 
      description: String(parsed.description || "无法获取描述"),
      insight: String(parsed.insight || "保持健康饮食！"),
      items: validItems 
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Propagate friendly error message
    throw new Error(error.message || "连接 AI 服务失败");
  }
}
