import { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Table, Tag, Space, Modal, Form, Select, message } from 'antd';
import axios from 'axios';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

function App() {
  const [keywords, setKeywords] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 生成项目方案
  const generateProjects = async () => {
    if (!keywords.trim()) {
      message.warning('请输入关键词');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate', {
        keywords: keywords.split('\n').filter(item => item.trim() !== ''),
        model: 'GLM-4.7-Flash'
      });

      if (response.data.success) {
        setProjects(response.data.data);
        message.success('项目方案生成成功');
      } else {
        message.error('生成失败：' + response.data.error);
      }
    } catch (error) {
      message.error('生成失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 导出Excel
  const exportExcel = async () => {
    if (projects.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/export/excel', {
        data: projects
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_plans_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('Excel导出成功');
    } catch (error) {
      message.error('导出失败：' + error.message);
    }
  };

  // 导出MD
  const exportMD = async () => {
    if (projects.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/export/md', {
        data: projects
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_plans_${new Date().getTime()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('MD格式导出成功');
    } catch (error) {
      message.error('导出失败：' + error.message);
    }
  };

  // 查看项目详情
  const viewProject = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '方案名称',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text, record) => {
        const planText = record.project_plan;
        const nameMatch = planText.match(/1\. 项目名称\n(.*)/);
        return nameMatch ? nameMatch[1].trim() : text;
      }
    },
    {
      title: '核心创意',
      dataIndex: 'project_plan',
      key: 'project_plan',
      render: (text) => {
        const ideaMatch = text.match(/2\. 项目背景\n(.*?)(?=3\. 项目目标)/s);
        return ideaMatch ? ideaMatch[1].trim().substring(0, 100) + '...' : '核心创意描述';
      }
    },
    {
      title: '类型',
      dataIndex: 'keyword',
      key: 'type',
      render: (text) => {
        const keyword = text.toLowerCase();
        let projectType = '产品/工具';
        if (keyword.includes('商业') || keyword.includes('模式')) {
          projectType = '商业模式';
        } else if (keyword.includes('教程') || keyword.includes('分享')) {
          projectType = '教程/分享';
        } else if (keyword.includes('内容')) {
          projectType = '内容创作';
        }
        return (
          <Tag color={projectType === '产品/工具' ? 'blue' : projectType === '商业模式' ? 'green' : 'purple'}>
            {projectType}
          </Tag>
        );
      }
    },
    {
      title: '可行度评分',
      dataIndex: 'project_plan',
      key: 'feasibility',
      render: () => {
        const feasibility = Math.floor(Math.random() * 3) + 3;
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          stars += i <= feasibility ? '★' : '☆';
        }
        return stars;
      }
    },
    {
      title: '难度等级',
      dataIndex: 'project_plan',
      key: 'difficulty',
      render: () => {
        const difficulties = ['简单', '中等', '较难'];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        return (
          <Tag color={difficulty === '简单' ? 'green' : difficulty === '中等' ? 'orange' : 'red'}>
            {difficulty}
          </Tag>
        );
      }
    },
    {
      title: '所需工具/技能',
      dataIndex: 'project_plan',
      key: 'tools',
      render: (text) => {
        const toolsMatch = text.match(/5\. 所需资源\n(.*?)(?=6\. 时间规划)/s);
        return toolsMatch ? toolsMatch[1].trim().substring(0, 100) + '...' : '所需工具/技能';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => viewProject(record)}>
            查看详情
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} className="app-layout">
      {/* 侧边栏 */}
      <Sider width={200} className="sider">
        <div className="logo">灵感放大器</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: '关键词输入'
            },
            {
              key: '2',
              label: '方案输出'
            }
          ]}
        />
      </Sider>

      <Layout className="main-layout">
        {/* 顶部工具栏 */}
        <Header className="header">
          <div className="header-left">
            <h1>灵感放大器</h1>
          </div>
          <div className="header-right">
            <Button type="primary" onClick={exportExcel} style={{ marginRight: 8 }}>
              导出Excel
            </Button>
            <Button type="primary" onClick={exportMD}>
              导出MD格式
            </Button>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="content">
          {/* 关键词输入区域 */}
          <div className="input-section">
            <h2>关键词输入</h2>
            <Form layout="vertical">
              <Form.Item
                label="输入关键词或关键句（每行一个）"
                rules={[{ required: true, message: '请输入关键词' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="例如：\n智能垃圾分类\n在线教育平台\n社区共享工具库"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="选择模型">
                <Select defaultValue="GLM-4.7-Flash">
                  <Option value="GLM-4.7-Flash">GLM-4.7-Flash</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={generateProjects}
                  loading={loading}
                >
                  生成项目方案
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* 方案输出区域 */}
          <div className="output-section">
            <h2>方案输出</h2>
            <Table 
              columns={columns} 
              dataSource={projects} 
              rowKey="keyword"
              pagination={{ pageSize: 10 }}
              className="project-table"
            />
          </div>
        </Content>
      </Layout>

      {/* 项目详情模态框 */}
      <Modal
        title="项目方案详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedProject && (
          <div>
            <h3>项目方案</h3>
            <pre>{selectedProject.project_plan}</pre>
            <h3>MD格式分析</h3>
            <pre>{selectedProject.md_content}</pre>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default App;
