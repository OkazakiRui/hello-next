import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// ファイルの pwd + ディレクトリ名
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 拡張子md を取り除いたファイル名を id とする
    const id = fileName.replace(/\.md$/, '');

    // ディレクトリ + ファイル名 で単一のパスを生成
    const fullPath = path.join(postsDirectory, fileName);
    // ファイルの中身を取得
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter で静的解析する
    const matterResult = matter(fileContents);

    // ファイル名を id にして返却
    return {
      id,
      ...matterResult.data,
    };
  });
  // posts の日付を見て sort
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
