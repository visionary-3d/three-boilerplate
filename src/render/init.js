import * as THREE from 'three'
import TickManager from './tick-manager.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

let scene,
  camera,
  renderer,
  composer,
  controls,
  stats,
  gui,
  renderWidth,
  renderHeight,
  renderAspectRatio
const renderTickManager = new TickManager()

export const initialize = () => {
  scene = new THREE.Scene()

  renderWidth = window.innerWidth
  renderHeight = window.innerHeight

  renderAspectRatio = renderWidth / renderHeight

  camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)
  camera.position.z = 2

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(renderWidth, renderHeight)
  document.body.appendChild(renderer.domElement)

  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  stats = Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()

  controls = new OrbitControls(camera, renderer.domElement)

  window.addEventListener(
    'resize',
    () => {
      renderWidth = window.innerWidth
      renderHeight = window.innerHeight
      renderAspectRatio = renderWidth / renderHeight

      camera.aspect = renderAspectRatio
      camera.updateProjectionMatrix()

      renderer.setSize(renderWidth, renderHeight)
      composer.setSize(renderWidth, renderHeight)
    },
    false
  )

  renderTickManager.startLoop()
}

export const useRenderer = () => renderer

export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })

export const useScene = () => scene

export const useCamera = () => camera

export const useControls = () => controls

export const useStats = () => stats

export const useComposer = () => composer

export const useGui = () => gui

export const addPass = (pass) => {
  composer.addPass(pass)
}

export const useTick = (fn) => {
  if (renderTickManager) {
    const _tick = (e) => {
      fn(e.data)
    }
    renderTickManager.addEventListener('tick', _tick)
  }
}
