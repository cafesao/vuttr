# API para VUTTR

Essa API foi feita para um desafio de back-end para a empresa BossaBox.

[Documentação](https://gabrieldiasdutra.docs.apiary.io)

## Para executar a API é muito fácil!

0 - Se você deseja apenas acessar a API e fazer request, acesse o link via [Insomnia](https://insomnia.rest/) ou outro programa parecido, ec2-54-232-45-139.sa-east-1.compute.amazonaws.com:3000/api e siga a documentação para fazer suas requests.

1 - Verifique se você tem o [Docker](https://docs.docker.com/get-docker/) && [Docker-Compose](https://docs.docker.com/compose/install/), instalado em seu computador.

![Image](https://i.imgur.com/9QmxeHZ.jpg)

2 - Faça um `git clone` deste repositório.

![Image](https://i.imgur.com/ZsbRGU9.jpg)

3 - Execute um terminal, e acesse a pasta onde você fez o `git clone`.

![Image](https://i.imgur.com/bat8EiK.jpg)

4 - Já dentro da pasta, apenas execute o comando `sudo docker-compose up --build`

![Image](https://i.imgur.com/v5q5m0i.jpg)

5 - Espere todo o processo, no final, você terá este log, informando que o server já esta iniciado.

![Image](https://i.imgur.com/mxAfD6E.jpg)

6 - Parabéns, agora você tem uma API rodando via docker em sua maquina, acesse pelo [Insomnia](https://insomnia.rest/) ou outro programa parecido a API, pela porta 3000, seguindo a documentação e aproveite.

## IMPORTANTE

Troque a **CHAVE_JWT** que esta dentro do arquivo .env, na raiz do projeto.

Essa chave serve para "assinar" os tokens, para criar uma nova, você pode utilizar o nodeJS + script que esta dentro da pasta tools

Para isso apenas acesse a pasta tools via terminal, e digite `node gerateJWT.js` e espere, ele ira devolver uma chave JWT, com ela em mãos, apenas troque a chave dentro do arquivo .env

![Image](https://i.imgur.com/QHUE32T.jpg)
