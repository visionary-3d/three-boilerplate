import * as THREE from 'three'
import {
  addPass,
  initialize,
  useCamera,
  useGui,
  useRenderSize,
  useScene,
  useTick,
} from './render/init.js'
// import postprocessing passes
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'

initialize()

const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  const { width, height } = useRenderSize()

  const ROTATION_SPEED = 0.02
  const MOTION_BLUR_AMOUNT = 0.725

  const dirLight = new THREE.DirectionalLight('#ffffff', 1)
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  scene.add(dirLight, ambientLight)

  const geometry = new THREE.IcosahedronGeometry()
  const material = new THREE.MeshStandardMaterial({
    color: '#4e62f9',
  })
  const ico = new THREE.Mesh(geometry, material)
  ico.add = new THREE.Mesh(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: '#000000' })
  )
  scene.add(ico)

  // GUI
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'z', 0, 10)
  cameraFolder.open()

  // postprocessing
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  }

  // save pass
  const savePass = new SavePass(new THREE.WebGLRenderTarget(width, height, renderTargetParameters))

  // blend pass
  const blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
  blendPass.uniforms['tDiffuse2'].value = savePass.renderTarget.texture
  blendPass.uniforms['mixRatio'].value = MOTION_BLUR_AMOUNT

  // output pass
  const outputPass = new ShaderPass(CopyShader)
  outputPass.renderToScreen = true

  // adding passes to composer
  addPass(blendPass)
  addPass(savePass)
  addPass(outputPass)

  const animateBox = () => {
    ico.rotation.x += ROTATION_SPEED
    ico.rotation.y += ROTATION_SPEED
  }

  useTick(({ timestamp, timeDiff }) => {
    animateBox()
  })
}

export default startApp;
