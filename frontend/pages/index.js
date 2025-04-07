import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [repos, setRepos] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // 获取欢迎信息
      fetch('http://localhost:8000/welcome', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setWelcomeMsg(data.message))
        
      // 获取仓库信息
      fetch('https://api.github.com/user/repos?sort=updated&per_page=3', {
        headers: {
          Authorization: `token ${session.accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      })
        .then(res => res.json())
        .then(data => setRepos(data.slice(0, 3)))
    }
  }, [session])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-6 w-full">
          {!session && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">欢迎使用DG Helper</h1>
              <button 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                onClick={() => signIn('github')}
              >
                使用GitHub登录
              </button>
            </div>
          )}
          
          {session && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">个人中心</h1>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="user-info">
                      <img 
                        src={session.user.image} 
                        alt="用户头像"
                        className="w-16 h-16"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">{session.user.name}</h2>
                      <p className="text-indigo-600">{session.user.email}</p>
                      <p className="text-gray-500 italic">{welcomeMsg}</p>
                    </div>
                  </div>
                  <button 
                    className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={() => signOut()}
                  >
                    退出登录
                  </button>
                </div>
              </div>
              
              <div className="w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">最近更新的仓库</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {repos.map(repo => (
                    <div key={repo.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <a 
                                href={repo.html_url} 
                                target="_blank"
                                className="text-lg font-bold text-gray-900 hover:text-indigo-600"
                              >
                                {repo.name}
                              </a>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {repo.language || 'Unknown'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {repo.description || '无描述'}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span>更新: {new Date(repo.updated_at).toLocaleDateString()}</span>
                              <span>{repo.stargazers_count} ⭐</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
