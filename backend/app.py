from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import pandas as pd
import markdown
import os
import json
import time
from config import GLM_API_KEY, GLM_API_URL, GLM_MODEL, DEBUG, PORT

app = Flask(__name__)
CORS(app)  # 启用CORS

# 生成项目方案的函数
def generate_project_plan(keyword):
    # 模拟响应，以便展示系统功能
    # 实际项目中应该调用真实的API
    
    # 职场类关键词识别
    career_keywords = ['职场', '工作', '职业', '办公', '企业', '管理', '团队', '绩效', '招聘', '培训']
    is_career_topic = any(keyword in keyword.lower() for keyword in career_keywords)
    
    if is_career_topic:
        # 职场类项目方案
        mock_response = f"""
1. 项目名称
职场效率提升系统

2. 项目背景
在当今竞争激烈的职场环境中，提高工作效率和团队协作能力成为企业成功的关键因素。传统的工作方式和管理方法已经难以满足现代企业的需求，需要一套系统化的解决方案来提升职场效率。

3. 项目目标
- 开发一套职场效率提升系统，优化工作流程
- 提高团队协作效率，减少沟通成本
- 建立科学的绩效评估体系，激发员工积极性
- 提供数据驱动的决策支持，提升管理水平

4. 实施方案
- 软件部分：开发集成协作平台，包含任务管理、沟通工具、绩效评估等模块
- 硬件部分：配置智能办公设备，如智能会议系统、考勤系统等
- 流程优化：重新设计工作流程，消除冗余环节
- 培训体系：建立员工技能培训和职业发展体系

5. 所需资源
- 软件：项目管理软件、协作工具、数据分析工具
- 硬件：智能办公设备、网络设备
- 人力资源：软件工程师、流程顾问、培训师
- 资金：软件开发、硬件采购、培训费用

6. 时间规划
- 需求分析：2周
- 系统设计：3周
- 软件开发：2个月
- 硬件部署：1个月
- 员工培训：2周
- 系统上线：1周

7. 预期成果
- 职场效率提升系统
- 优化后的工作流程
- 员工技能提升
- 绩效评估体系

8. 风险评估
- 技术风险：系统稳定性和安全性
- 组织风险：员工对新系统的接受度
- 成本风险：项目预算超支
- 时间风险：项目延期

9. 实施步骤
1. 项目启动，组建团队
2. 进行需求调研和分析
3. 设计系统架构和工作流程
4. 开发和测试系统
5. 部署硬件设备
6. 开展员工培训
7. 系统上线和试运行
8. 收集反馈并优化
9. 正式推广和应用
"""
    else:
        # 通用项目方案
        mock_response = f"""
1. 项目名称
智能垃圾分类系统

2. 项目背景
随着城市化进程的加速，垃圾产生量不断增加，传统的垃圾分类方式效率低下，难以满足环保需求。智能垃圾分类系统利用人工智能技术，实现垃圾的自动识别和分类，提高分类准确率和效率。

3. 项目目标
- 开发一套智能垃圾分类系统，实现垃圾的自动识别和分类
- 提高垃圾分类准确率，达到95%以上
- 降低人工分类成本，提高分类效率
- 促进资源回收利用，减少环境污染

4. 实施方案
- 硬件部分：安装智能垃圾桶，配备摄像头和传感器
- 软件部分：开发垃圾识别算法，基于深度学习技术
- 系统集成：将硬件和软件集成，实现自动分类功能
- 数据管理：建立垃圾分类数据库，持续优化算法

5. 所需资源
- 硬件：智能垃圾桶、摄像头、传感器、处理器
- 软件：深度学习框架、垃圾识别算法、数据管理系统
- 人力资源：硬件工程师、软件工程师、数据科学家
- 资金：设备采购、软件开发、系统集成、运营维护

6. 时间规划
- 前期调研：1个月
- 硬件开发：2个月
- 软件开发：3个月
- 系统集成：1个月
- 测试与优化：1个月
- 部署与推广：2个月

7. 预期成果
- 智能垃圾分类系统原型
- 垃圾识别算法，准确率达到95%以上
- 系统部署方案
- 运营维护手册

8. 风险评估
- 技术风险：垃圾识别准确率可能达不到预期
- 成本风险：硬件设备成本可能超出预算
- 运营风险：用户可能不适应新系统
- 政策风险：相关政策可能发生变化

9. 实施步骤
1. 项目启动，组建团队
2. 进行市场调研和技术可行性分析
3. 设计系统架构和技术方案
4. 开发硬件原型
5. 开发垃圾识别算法
6. 系统集成和测试
7. 优化和改进
8. 小规模试点
9. 大规模部署和推广
"""
    
    # 模拟API调用延迟
    import time
    time.sleep(2)
    
    return mock_response

# 生成MD格式的分析和方案
def generate_md_content(keyword, project_plan):
    md_content = f"""# 项目方案分析

## 关键词
{keyword}

## 项目方案
{project_plan}

## 方案分析
### 可行性评估
- 技术可行性：基于当前技术水平，方案中的技术需求是否可实现
- 经济可行性：方案的成本投入与预期收益是否合理
- 时间可行性：方案的时间规划是否合理

### 实施建议
1. 优先级排序：确定项目实施的优先级
2. 资源分配：合理分配项目所需的资源
3. 风险管理：制定风险应对策略
4. 监控评估：建立项目监控和评估机制

## 总结
本方案基于关键词"{keyword}"生成，包含了详细的项目规划和实施建议，具有较强的可落地性和创新性。
"""
    return md_content

# 生成Excel文件
def generate_excel(data):
    df = pd.DataFrame(data)
    filename = f"project_plans_{int(time.time())}.xlsx"
    df.to_excel(filename, index=False)
    return filename

# 首页路由
@app.route('/')
def index():
    return "灵感放大器API服务"

# 生成项目方案的API路由
@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        keywords = data.get('keywords', [])
        
        if not keywords:
            return jsonify({"success": False, "error": "请提供关键词"})
        
        results = []
        for keyword in keywords:
            project_plan = generate_project_plan(keyword)
            md_content = generate_md_content(keyword, project_plan)
            
            results.append({
                "keyword": keyword,
                "project_plan": project_plan,
                "md_content": md_content
            })
        
        return jsonify({"success": True, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# 导出Excel的API路由
@app.route('/api/export/excel', methods=['POST'])
def export_excel():
    try:
        data = request.json
        items = data.get('data', [])
        
        if not items:
            return jsonify({"success": False, "error": "没有数据可导出"})
        
        # 准备Excel数据
        excel_data = []
        for item in items:
            excel_data.append({
                "关键词": item.get('keyword', ''),
                "项目方案": item.get('project_plan', ''),
                "MD格式分析": item.get('md_content', '')
            })
        
        # 生成Excel文件
        filename = generate_excel(excel_data)
        
        # 返回文件
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# 导出MD的API路由
@app.route('/api/export/md', methods=['POST'])
def export_md():
    try:
        data = request.json
        items = data.get('data', [])
        
        if not items:
            return jsonify({"success": False, "error": "没有数据可导出"})
        
        # 生成MD内容
        md_content = "# 灵感放大器项目方案\n\n"
        for i, item in enumerate(items, 1):
            md_content += f"## 方案 {i}: {item.get('keyword', '')}\n\n"
            md_content += item.get('md_content', '')
            md_content += "\n\n"
        
        # 保存MD文件
        filename = f"project_plans_{int(time.time())}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        # 返回文件
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT, host='0.0.0.0')
