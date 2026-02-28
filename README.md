# Gerador de Posts - Jogos do Dia

Aplicação web simples para o administrador montar artes de jogos do dia com:

- título da campanha e competição,
- data do post,
- nome da casa de aposta,
- lista de partidas com horário e odd,
- upload do mascote para compor o layout.

## Como usar

1. Abra `index.html` no navegador (ou rode um servidor local).
2. Preencha os campos do painel esquerdo.
3. Adicione/remova jogos e informe as odds.
4. Faça upload do mascote.
5. Clique em **Gerar imagem** e depois em **Baixar PNG**.

## Rodar com servidor local

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173`.
