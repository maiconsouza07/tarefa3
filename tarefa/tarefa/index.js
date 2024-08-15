const fs = require('fs');
const path = require('path');


const dadosFilePath = path.join(__dirname, 'dados.json');


fs.readFile(dadosFilePath, 'utf8', (err, dados) => {
    if (err) {
        console.error('Erro ao ler o arquivo dados.json:', err);
        return;
    }

    const { alunos } = JSON.parse(dados);

    let aprovados = 0;
    let reprovados = 0;
    let exame = 0;

    alunos.forEach(aluno => {
        
        if (aluno.media >= 60) {
            aprovados++;
        } else if (aluno.media < 30) {
            reprovados++;
        } else {
            exame++;
        }

        const dirName = path.join(__dirname, 'resultados', `${aluno.nome}_${aluno.matricula}`);

        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                console.error(`Falha ao criar diretório para ${aluno.nome}:`, err);
                return;
            }

            aluno.projetos.forEach(projeto => {
                const filePath = path.join(dirName, `${projeto.titulo}.txt`);

               
                fs.writeFile(filePath, projeto.resumo, (err) => {
                    if (err) {
                        console.error(`Falha ao salvar o trabalho ${projeto.titulo} de ${aluno.nome}:`, err);
                    }
                });
            });
        });
    });

   
    const resultado = {
        apr: aprovados,
        exm: exame,
        rep: reprovados
    };

   
    const resultadoFilePath = path.join(__dirname, 'resultados', 'resultado.json');

    
    fs.writeFile(resultadoFilePath, JSON.stringify(resultado), (err) => {
        if (err) {
            console.error('Erro ao salvar arquivo final:', err);
        } else {
            console.log('Arquivo final salvo com sucesso!');
        }
    });
});
