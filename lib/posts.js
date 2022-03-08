import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ファイルの pwd + ディレクトリ名
const postsDirectory = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
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
      ...matterResult,
    };
  });
  // posts の日付を見て sort
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) return 1;
    else return -1;
  });
};

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

export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  return {
    id,
    ...matterResult.data,
  };
}
