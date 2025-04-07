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
        
      
      // 仅GitHub用户获取仓库信息
      if (session.provider === 'github') {
        fetch('https://api.github.com/user/repos?sort=updated&per_page=3', {
          headers: {
            Authorization: `token ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        })
          .then(res => res.json())
          .then(data => setRepos(data.slice(0, 3)))
      }
    }
  }, [session])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-6 w-full">
          {!session && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">欢迎使用DG Helper</h1>
              <div className="space-y-4">
                <button 
                  className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  onClick={() => signIn('github')}
                >
                  使用GitHub登录
                </button>
                <button 
                  className="w-full bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md"
                  onClick={() => signIn('google')}
                >
                  使用Google登录
                </button>
              </div>
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
              
              {session.provider === 'github' && (
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
              )}
              {session.account?.provider === 'google' && (
                <div className="w-full">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">欢迎使用DG Helper</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-800">账户信息</h4>
                          <p className="text-gray-600">邮箱: {session.user.email}</p>
                          <p className="text-gray-600">注册时间: {new Date(session.user.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-lg font-medium text-gray-800 mb-2">功能提示</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>点击右上角头像可查看个人资料</li>
                          <li>随时可以切换其他登录方式</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
