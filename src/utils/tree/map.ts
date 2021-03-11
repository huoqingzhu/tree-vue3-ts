import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const SEPARATION = 60; //距离
const AMOUNTX = 50; //x横坐标
const AMOUNTY = 50; //y坐标
let particles:any; //粒子数组
let particle:any; //粒子
let count = 0; //控制粒子变化的变量
class Map {
  public camera:THREE.Camera//相机
  public scene:THREE.Scene=new THREE.Scene();//场景
  public renderer:THREE.WebGLRenderer=new THREE.WebGLRenderer({ antialias: true, alpha: true });//渲染
  public controls:any//鼠标控制系统
  public container:HTMLElement|null//渲染场景
  public callBack?:Function//在reader执行的回调参数
  public raycaster = new THREE.Raycaster();//用来选择对象
  public mouse = new THREE.Vector2();//鼠标在场景中的位置
  public isParticle:boolean=false;


  /**
   * 
   * @param container 
   * @param camera 是否是透视相机
   * @param Light 
   * @param particle 是否开启粒子效果
   */
  constructor(container:HTMLElement|null,camera:boolean=true,Light:boolean=true,isParticle:boolean=false) {
    this.container = container
    // this.callBack=callBack
    /**
     * 相机设置
     */
    this.isParticle=isParticle
    let width = this.container!.clientWidth; //窗口宽度
    let height = this.container!.clientHeight; //窗口高度
    let k = (width / height); //窗口宽高比
    let s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象 
    // 正向投影
    if(!camera){
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    }else{//透视投影
      this.camera = new THREE.PerspectiveCamera( 75, width/height, 1, 10000 );
      this.camera.position.z = 1000;
      this.camera.position.x = 133.99999999999972;
      this.camera.position.y = 437.99999999999943;
    }
    //渲染器我们需要阴影效果：
    this.renderer.shadowMap.enabled = true;
    /**
     * 创建渲染器对象
     */
    //辅助三维坐标系AxisHelper
    // let axisHelper = new THREE.AxesHelper(450);
    // this.scene.add(axisHelper);
    
    this.renderer.setSize(width, height); //设置渲染区域尺寸
    // 初始化控制系统
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // 是否预先设置光照
    if(Light){
    let ambient = new THREE.AmbientLight(0xffffff);
     this.scene.add(ambient); //环境光对象添加到scene场景中
    }
    if(isParticle){
      this.lizi()
    }
    this.camera.position.set(0, 200, 300); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
  }
  // 初始化
  init = (call?:Function) => {
    //点光源
    this.renderer.setClearColor(0xEEEEEE, 0.0);//设置背景颜色(0x4169E1, 1)
    this.container!.appendChild(this.renderer.domElement); //body元素中插入canvas对象
        // 上下旋转范围
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI/3;
        this.controls.autoRotate=true
        this.controls.autoRotateSpeed=0.5
    this.createControls()//监听窗口变化
    this.render()
  }
  // 渲染函数
  render = () => {
    requestAnimationFrame(this.render); //请求再次执行渲染函数render
    this.renderer.render(this.scene, this.camera);//执行渲染操作
    if(this.isParticle){
        let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++];
          particle.position.y =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          particle.scale.x = particle.scale.y =
            (Math.sin((ix + count) * 0.3) + 1) * 2 +
            (Math.sin((iy + count) * 0.5) + 1) * 2;
        }
      }
      count += 0.1;
    }
    

    this.controls.update()
  }
lizi = () => {
    particles = [];
    const PI2 = Math.PI * 1;
    const material = new THREE.SpriteMaterial({
      color: "#6cedfc",
      // @ts-ignore
      program: (context:any) => {
        context.beginPath();
        context.arc(0, 0, 1, 0, PI2, true);
        context.fill();
      },
    });

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++] = new THREE.Sprite(material);
        particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        this.scene.add(particle);
      }
    }
  };
  createControls = () => {
    // 监听浏览器窗口的变化
    addEventListener('resize', (e) => {
      this.renderer.setSize(this.container!.clientWidth, this.container!.clientHeight);
    }, false);
  }
  // 监控点击事件
  // 监控点击事件
  onMouseMove = () => {
    addEventListener("click", (event: { clientX: number; clientY: number; }) => {
      console.log(event.clientX,event.clientY);
       // 拿到鼠标在屏幕的坐标
        let mouseX = event.clientX;//鼠标单击位置横坐标
        let mouseY = event.clientY;//鼠标单击位置纵坐标 
        const rect=this.container?.getBoundingClientRect();//拿到div相对屏幕坐标的偏移量
        //屏幕坐标转标准设备坐标
        const x = ((mouseX - rect!.left) / this.container!.clientWidth) * 2 - 1;
        const y = - ((mouseY - rect!.top) / this.container!.clientHeight) * 2 + 1;
        let standardVector  = new THREE.Vector3(x, y);//标准设备坐标
        //标准设备坐标转世界坐标
        let worldVector = standardVector.unproject(this.camera);
        console.log(`标转世界坐标${worldVector.x},${worldVector.y},${worldVector.z}`);
        //射线投射方向单位向量(worldVector坐标减相机位置坐标)
        let ray = worldVector.sub(this.camera.position).normalize();
        //创建射线投射器对象
        let raycaster = new THREE.Raycaster(this.camera.position, ray);//光线投射的起点向量。  光线投射的方向向量，应该是被归一化的。
        //返回射线选中的对象
        let intersects:any = raycaster.intersectObjects(this.scene.children,true);//第二参数 是否遍历后代
        console.log(intersects);
        if (intersects.length > 0) {
            intersects[0].object.material.transparent = true;
            intersects[0].object.material.opacity = 0.2;
        }
    });   
  }
  // 添加动态模型
  addMesh(Mesh:THREE.Object3D|THREE.Sprite) {
    this.scene.add(Mesh)
  }
}
export default Map