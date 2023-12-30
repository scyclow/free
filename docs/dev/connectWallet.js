import {createComponent} from './$.js'
import {provider} from './eth.js'



createComponent(
  'connect-wallet',
  `
    <style>
      .hidden {
        display: none;
      }
    </style>

    <section>
      <section id="case-noWeb3" class="hidden">
        <slot name="noWeb3"></slot>
      </section>

      <section id="case-notConnected" class="hidden">
        <slot name="notConnected"></slot>
      </section>

      <section id="case-connected" class="hidden">
        <slot name="connected"></slot>
      </section>

      <section id="case-connectionError" class="hidden">
        <slot name="connectionError"></slot>
      </section>
    </section>
  `,
  {
    isEthBrowser: false,
    connectedAddr: null,
    connectionError: null,
  },
  (ctx) => {
    ctx.provider = provider
    ctx.$noWeb3 = ctx.$('#case-noWeb3')
    ctx.$connected = ctx.$('#case-connected')
    ctx.$notConnected = ctx.$('#case-notConnected')
    ctx.$connectionError = ctx.$('#case-connectionError')

    ctx.setState({
      isEthBrowser: ctx.provider.isEthBrowser
    })

    ctx.provider.onConnect(
      connectedAddr => ctx.setState({
        connectedAddr
      }),
      connectionError => ctx.setState({
        connectionError
      })
    )
  },
  ctx => {
    [
      ctx.$noWeb3,
      ctx.$connected,
      ctx.$notConnected,
      ctx.$connectionError,
    ].forEach($case => {
      $case.classList.add('hidden')
    })

    if (!ctx.state.isEthBrowser) {
      ctx.$noWeb3.classList.remove('hidden')
    } else if (ctx.state.connectionError) {
      ctx.$connectionError.classList.remove('hidden')
    } else if (ctx.state.connectedAddr) {
      ctx.$connected.classList.remove('hidden')
    } else {
      ctx.$notConnected.classList.remove('hidden')
    }
  }
)



createComponent(
  'connect-button',
  `
    <style>
      .hidden {
        display: none;
      }

      .error {
        color: var(--red-color);
      }
    </style>

    <div>
      <div style="display: flex; justify-content: center"><slot name="button" id="case-connectNotLoading" class="hidden"></slot></div>
      <div><slot name="loading" id="case-connectLoading" class="hidden"></slot></div>
      <div><slot name="error" id="case-connectError" class="hidden error"></slot></div>
    </div>
  `,
  {
    loading: false,
    error: false,
  },
  ctx => {
    ctx.provider = provider
    ctx.$connectNotLoading = ctx.$('#case-connectNotLoading')
    ctx.$connectLoading = ctx.$('#case-connectLoading')
    ctx.$connectError = ctx.$('#case-connectError')

    Array.from(ctx.children).forEach(child => {
      if (child.tagName === 'BUTTON') ctx.$button = child
    })

    ctx.$button.addEventListener('click', async () => {
      ctx.setState({ error: false, loading: true })
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }, [])
        const address = await ctx.provider.isConnected()
        ctx.provider.connect()

      } catch (error) {
        ctx.setState({ error, loading: false })
        console.error(error)
      }
    })
  },
  ctx => {
    [
      ctx.$connectNotLoading,
      ctx.$connectLoading,
      ctx.$connectError,
    ].forEach(c => {
      c.classList.add('hidden')
    })

    if (ctx.state.error) {
      ctx.$connectNotLoading.classList.remove('hidden')
      ctx.$connectError.classList.remove('hidden')
      ctx.$connectError.innerHTML = ctx.state.error?.message
    } else if (ctx.state.loading) {
      ctx.$connectLoading.classList.remove('hidden')
    } else {
      ctx.$connectNotLoading.classList.remove('hidden')
    }

  },
)

