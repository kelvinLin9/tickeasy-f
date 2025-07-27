import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 獲取當前文件的目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 圖標目錄和註冊文件路徑
const iconsDir = path.resolve(__dirname, "../../assets/icons");
const registerFilePath = path.resolve(__dirname, "../icons/register.ts");

// 讀取所有 SVG 文件
function getAllSvgFiles() {
  return fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => ({
      name: path.basename(file, ".svg"),
      path: path.join(iconsDir, file),
    }));
}

// 從 SVG 文件中提取必要的信息
function extractSvgInfo(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // 提取 viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1].split(" ") : ["0", "0", "24", "24"];
  const width = parseInt(viewBox[2], 10);
  const height = parseInt(viewBox[3], 10);

  // 提取 SVG 內容 (去掉 svg 標籤)
  let body = content
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<svg[^>]*>/g, "")
    .replace(/<\/svg>/g, "")
    .trim();

  // 替換 fill 顏色為 currentColor (如果有指定顏色)
  body = body.replace(/fill="[^"]+"/g, 'fill="currentColor"');

  // 正確處理引號和換行符
  body = body
    .replace(/"/g, '\\"') // 轉義雙引號
    .replace(/\n/g, " ") // 將換行符替換為空格
    .replace(/\s+/g, " "); // 將多個空格替換為單個空格

  return { body, width, height };
}

// 生成註冊代碼
function generateRegisterCode(icons) {
  let code = `import { addIcon } from '@iconify-icon/react';\n\n`;

  icons.forEach((icon) => {
    const { name, body, width, height } = icon;
    code += `// 註冊 ${name} 圖標\n`;
    code += `addIcon('my-${name}', {\n`;
    code += `  body: "${body}",\n`; // 使用雙引號包裹，因為內容已經轉義了雙引號
    code += `  width: ${width},\n`;
    code += `  height: ${height}\n`;
    code += `});\n\n`;
  });

  return code;
}

// 主函數
function registerAllIcons() {
  try {
    const svgFiles = getAllSvgFiles();

    const icons = svgFiles.map((file) => {
      const { body, width, height } = extractSvgInfo(file.path);
      return {
        name: file.name,
        body,
        width,
        height,
      };
    });

    const registerCode = generateRegisterCode(icons);
    fs.writeFileSync(registerFilePath, registerCode);

    // console.log(`成功註冊 ${icons.length} 個圖標到 ${registerFilePath}`);
  } catch {
    // console.error("註冊圖標時發生錯誤:", error);
  }
}

export { registerAllIcons };
