'use client';

import { useState, useEffect } from 'react';
import { Octokit } from 'octokit';

const octokit = new Octokit({});

export interface Commit {
  message: string;
  sha: string;
  repo: string;
  owner: string;
  date: string;
}

export async function fetchLatestCommit(owner: string, repo: string): Promise<Commit | null> {
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });
    if (data.length > 0) {
      return {
        message: data[0].commit.message.split('\n')[0],
        sha: data[0].sha,
        repo,
        owner,
        date: data[0].commit.committer?.date ?? '',
      };
    }
  } catch {}
  return null;
}

const CommitLog = ({ owner = 'zhn2605', repo }: { owner?: string; repo: string }) => {
  const [commit, setCommit] = useState<Commit | null>(null);

  useEffect(() => {
    fetchLatestCommit(owner, repo).then(setCommit);
  }, [owner, repo]);

  if (!commit) return null;

  return (
    <a
      href={`https://github.com/${owner}/${commit.repo}/commit/${commit.sha}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pd-[0.2vw] text-[#6A6A6A] hover:bg-[#6A6A6A] hover:text-[#1A1A1A] italic"
    >
      @{commit.message}
    </a>
  );
};

export default CommitLog;
