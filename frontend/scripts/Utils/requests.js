const HOST = import.meta.env.VITE_host
const URL = `http://${HOST}:3000/graphql`

export const fetchAllComponents = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query getall {
      components {
        ... on Case {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          supportedMotherboardFormats
          maxLengthGPU
          pciSlots
          psuBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          motherboardBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          drivesBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          fansBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
        }
        ... on Cooler {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          diameter
          noise
        }
        ... on CPU {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          series
          integratedGraphics
          socket
          coreCount
          threadCount
          clockSpeed
          cacheSize
          tdp
          coolerBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
        }
        ... on CPUCooler {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          diameter
          noise

          supportedSockets
          tdp
        }
        ... on GPU {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          series
          vramSize
          vramType
          length
          tdp
          slots
          cores
          clockSpeed
        }
        ... on Memory {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          generation
          size
          speed
        }
        ... on Storage {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          type
          formatConnection
          capacity
          read
          write
        }
        ... on Motherboard {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          format
          socket
          chipset
          supportedMemoryTypes
          memorySlots
          maxMemory
          cpuBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          ramBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          gpuBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
        }
        ... on PSU {
          id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          power
          format
          rating
          modular
        }
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchCases = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query cases {
      cases {
              id
          name
          objectType
          manufacturer
          price
          imageUrl
          modelUrl
          scale {
            x
            y
            z
          }
          rotation {
            x
            y
            z
          }
          active

          supportedMotherboardFormats
          maxLengthGPU
          pciSlots
          psuBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          motherboardBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          drivesBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
          fansBB {
            scale {
              x
              y
              z
            }
            position {
              x
              y
              z
            }
          }
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchCoolers = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query coolers {
      coolers {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        diameter
        noise
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchCPUs = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query cpus {
      cpus {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        series
        integratedGraphics
        socket
        coreCount
        threadCount
        clockSpeed
        cacheSize
        tdp
        coolerBB {
          scale {
            x
            y
            z
          }
          position {
            x
            y
            z
          }
        }
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchCPUCoolers = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query cpucoolers {
      cpucoolers {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        diameter
        noise

        supportedSockets
        tdp
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchGPUs = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query gpus {
      gpus {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        series
        vramSize
        vramType
        length
        tdp
        slots
        cores
        clockSpeed
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchMemory = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query memory {
      memory {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        generation
        size
        speed
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchStorage = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query storage {
      storage {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        type
        formatConnection
        capacity
        read
        write
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchMotherboards = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query motherboards {
      motherboards {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        format
        socket
        chipset
        supportedMemoryTypes
        memorySlots
        maxMemory
        cpuBB {
          scale {
            x
            y
            z
          }
          position {
            x
            y
            z
          }
        }
        ramBB {
          scale {
            x
            y
            z
          }
          position {
            x
            y
            z
          }
        }
        gpuBB {
          scale {
            x
            y
            z
          }
          position {
            x
            y
            z
          }
        }
      }
    }`,
    }),
  }).then((result) => result.json())
}

export const fetchPSUs = async () => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query psus {
      psus {
        id
        name
        objectType
        manufacturer
        price
        imageUrl
        modelUrl
        scale {
          x
          y
          z
        }
        rotation {
          x
          y
          z
        }
        active

        power
        format
        rating
        modular
      }
    }`,
    }),
  }).then((result) => result.json())
}
