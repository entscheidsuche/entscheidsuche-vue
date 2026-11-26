<template>
  <div id="organization">
    <template v-if="locale==='de'">
      <h1>Suchhilfe</h1>
      <p>Auf entscheidsuche.ch stehen Ihnen zwei Sucharten zur Verfügung: die Textsuche (Schaltfläche «Suchen») und die neue KI-Suche (Schaltfläche «KI-Suche»). Beide können
         mit Metadaten ergänzt werden. Im Suchfeld können Sie beliebige Suchbegriffe eingeben. Die Klein- und Grossschreibung spielt dabei keine Rolle.
      </p>
      <div class="help-columns">
        <div class="help-col-left" ref="leftCol">
          <h2>Textsuche <small>(Schaltfläche «Suchen»)</small></h2>
          <h3>Funktionsweise</h3>
          <p>Die Textsuche ist eine Volltextsuche: Sie findet Entscheide, in denen Ihre Suchbegriffe wörtlich vorkommen – in der Schreibweise und in der Sprache, in der Sie
             sie eingeben. Mit den folgenden Operatoren können Sie die Suche präzisieren.
          </p>
          <h3>Trunkierung</h3>
          <p>Suchen Sie z.B. mit <i>Eigentümer</i>, so erhalten Sie nur Dokumente, in denen der Begriff so vorkommt. Dokumente, in denen <i>Eigentümerin</i> oder
             <i>Eigentümers</i> enthalten sind, werden nicht gefunden. Mit <i>Eigentümer*</i> werden jedoch alle Wörter gefunden, die so beginnen. Sie können dabei auch
             Linkstrunkieren, d.h. <i>*Eigentümer</i> findet auch Begriffe, wie z.B. <i>Grundeigentümer</i>. Auch eine kombiniert Links- und Rechtstrunkierung ist möglich:
             <i>*Eigentümer*</i>. Sie findet z.B. auch die <i>Grundeigentümerin</i>. Auch können einzelne Buchstaben durch einen Platzhalter ersetzt werden. So findet <i>?udex</i>
             sowohl <i>judex</i> als auch <i>iudex</i>.
          </p>
          <h3>Fuzzy-Suche</h3>
          <p>Begriffe können auch in ähnlicher Schreibweise gesucht werden. Dazu wird eine angefügte Tilde (<i>~</i>) verwendet. Dabei wird eine <a href="https://de.wikipedia.org/wiki/Levenshtein-Distanz">Levenshtein-Distanz</a>
             von 2 verwendet. So findet <i>Eigentümer~</i> auch <i>Eigentümerin</i>. Schwächere oder stärkere Abweichungen können mit <i>Eigentümer~1</i> oder <i>Eigentümer~3</i> gefunden werden.
             Die Fuzzy-Suche kann in einem Suchbegriff nicht mit der Trunkierung kombiniert werden.
          </p>
          <h3>Logische Verknüpfung</h3>
          <p>Wenn Sie mit zwei Suchbegriffen suchen, werden diese automatisch mit <i>AND</i> verknüpft. Das bedeutet, dass beide Begriffe gleichzeitig in der Suche enthalten sein müssen.
             Wenn Sie Dokumente finden möchten, in denen mindestens einer der Suchbegriffe enthalten ist, verwenden Sie die <i>OR</i>-Verknüpfung. Bei den Verknüpfungsoperatoren ist die
             Grossschreibweise wichtig, da sie sonst als normale Suchbegriffe gesucht werden. Sie können auch <i>AND</i> und <i>OR</i>-Operatoren verbinden. So findet
             <i>(Mord OR Totschlag) AND Alkohol</i> alle Dokumente, die <i>Mord</i> oder <i>Totschlag</i> sowie auch <i>Alkohol</i> enthalten. Dabei müssen jedoch <b>ZWINGEND</b> Klammern
             gesetzt werden. Ohne Klammern würde der Suchbegriff <i>Mord</i> ignoriert werden.
          </p>
          <p>Sie können auch nach allen Dokumenten suchen, die einen Begriff nicht enthalten. So findet <i>NOT Mord</i> alle Dokumente, in denen der Begriff <i>Mord</i> nicht vorkommt.
          </p>
          <h3>Phrasensuche</h3>
          <p>Sie können mit Anführungszeichen eine feste Wortfolge suchen. Mit <i>"droit des obligations"</i> finden Sie die Wörter genau in dieser Reihenfolge. Dies ist auch empfehlenswert
             für die Suche mit Geschäftsnummern: <i>"4C.296/2003"</i>.
          </p>
          <h3>Distanzsuche</h3>
          <p>Suchen Sie Begriffe, die im gleichen Kontext vorkommen, können Sie das mit der Distanzsuche finden: <i>"Enteignung Verkehrswert"~5</i> findet die beiden Begriffe im maximalen Abstand
             von 5 Wörtern.
          </p>
        </div>
        <div class="help-col-right" ref="rightCol">
          <h2>KI-Suche <small>(Schaltfläche «KI-Suche»)</small></h2>
          <h3>Funktionsweise</h3>
          <p>Die KI-Suche sucht nicht nach Wörtern, sondern nach Bedeutung. Sie beruht auf sogenannten Embeddings: Ein Sprachmodell wandelt jeden Textabschnitt der Entscheide
             in einen Zahlenvektor um, der den Inhalt des Abschnitts abbildet. Ihre Anfrage wird auf dieselbe Weise umgewandelt; gefunden werden die Textabschnitte, deren
             Vektoren demjenigen Ihrer Anfrage am nächsten liegen. Die KI-Suche findet deshalb auch Entscheide, die einen Sachverhalt mit anderen Worten beschreiben.
          </p>
          <h3>Sprachübergreifende Suche</h3>
          <p>Die Embeddings bilden die Bedeutung unabhängig von der Sprache ab. Eine auf Deutsch formulierte Anfrage findet deshalb auch Entscheide, die in französischer
             oder italienischer Sprache abgefasst sind – und umgekehrt. Sie müssen Ihre Anfrage also nicht in die anderen Landessprachen übersetzen.
             Entscheide in der Sprache Ihrer Anfrage stehen in der Trefferliste allerdings häufig weiter vorne.
          </p>
          <h3>Anfrage formulieren</h3>
          <p>Die KI-Suche funktioniert am besten, wenn Sie Ihr Anliegen in einem oder mehreren Sätzen beschreiben, statt nur Stichwörter einzugeben. Statt
             <i>Haftung Glatteis</i> schreiben Sie zum Beispiel <i>Ein Fussgänger rutscht im Winter auf dem vereisten Trottoir vor einem Geschäft aus und verletzt sich.
             Wer haftet?</i> So finden Sie Entscheide zur Werkeigentümerhaftung (Art. 58 OR), obwohl dieser Begriff in der Anfrage nicht vorkommt – darunter auch
             Entscheide in französischer und italienischer Sprache.
          </p>
          <h3>Trefferliste statt Antwort</h3>
          <p>Anders als ein Chatbot formuliert die KI-Suche keine Antwort auf Ihre Frage. Sie erhalten weiterhin eine Trefferliste mit Entscheiden, die Sie selbst sichten und
             beurteilen. Die Liste ist nach inhaltlicher Nähe zu Ihrer Anfrage geordnet; eine andere Sortierung steht bei der KI-Suche nicht zur Verfügung.
          </p>
          <p>Wenn Sie eine ausformulierte Antwort wünschen, können Sie entscheidsuche.ch von einem KI-Assistenten wie ChatGPT oder Claude nutzen lassen. Dafür steht das
             MCP-Interface unter <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a> zur Verfügung. MCP (Model Context Protocol) ist ein offener
             Standard, über den KI-Anwendungen auf externe Datenquellen zugreifen. Das MCP-Interface bietet sowohl die Textsuche als auch die KI-Suche an. Ist
             entscheidsuche.ch auf diesem Weg eingebunden, führt der KI-Assistent die Suche selbst aus, liest die gefundenen Entscheide und formuliert auf dieser Grundlage
             eine Antwort mit Verweisen auf die Entscheide.
          </p>
          <p>Die Antwort stammt in diesem Fall vom jeweiligen KI-Assistenten und nicht von entscheidsuche.ch. Prüfen Sie sie deshalb anhand der zitierten Entscheide.
          </p>
          <h3>Anzahl der Treffer</h3>
          <p>Die KI-Suche ermittelt die 100 Textabschnitte, die am besten zu Ihrer Anfrage passen. Liegen mehrere dieser Abschnitte im selben Entscheid, erscheint dieser nur
             einmal in der Trefferliste. Die Liste enthält deshalb in der Regel weniger als 100 Entscheide.
          </p>
          <p>Ist beim Start der KI-Suche bereits ein Metadatenfilter gesetzt, werden die 100 am besten passenden Textabschnitte nur innerhalb dieser Einschränkung ermittelt.
             Setzen oder ändern Sie einen Filter erst nach der Suche, wird er zunächst auf die bereits gefundenen Treffer angewendet; die Trefferliste wird dadurch kürzer.
             Bleiben dabei zu wenige Entscheide übrig, wird die KI-Suche automatisch mit dem Filter neu ausgeführt, sodass Sie wieder die besten Treffer innerhalb der gewählten
             Einschränkung erhalten. Währenddessen erscheint der Hinweis «Suche neu mit Filter».
          </p>
        </div>
      </div>
      <h2>Metadaten</h2>
      <p>Beide Sucharten können mit Metadaten kombiniert werden. Als Metadaten stehen Ihnen das Entscheiddatum (wenn dieses nicht vorhanden ist, wird das Publikationsdatum verwendet), der Kanton,
         das Gericht und teilweise auch die Kammer zur Verfügung.</p>
      <p>Den Datumsbereich können Sie mit dem Datumsschieber einschränken.</p>
      <p>Die Suche kann auf die eidgenössischen Gerichte oder verschieden Kantone eingeschränkt werden, in dem Sie diese Links anklicken. Diese können den Kanton expandieren und sehen dann
         die dort verfügbaren Gerichte und darunter teilweise auch die Kammern.</p>
      <p>Die Metadaten werden stets mit den aktuellen Suchbegriffen verknüpft. Sollten Sie bei der Textsuche nur mit Metadaten suchen wollen, geben Sie als Suchbegriff <i>*</i> ein.</p>
      <h2>Aktualisierungen</h2>
      <p>Unter <b-link href="status">Datenstand</b-link> finden Sie eine Übersicht unserer Quellen mit dem Datum des jeweils letzten Abgleichs.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Astuces pour la recherche</h1>
      <p>entscheidsuche.ch vous propose deux modes de recherche : la recherche de texte (bouton « Rechercher ») et la nouvelle recherche IA (bouton « Rechercher IA »).
         Les deux peuvent être complétées par des métadonnées. Vous pouvez saisir n'importe quel terme dans le champ de recherche. La casse (minuscules et majuscules)
         ne joue pas de rôle.
      </p>
      <div class="help-columns">
        <div class="help-col-left" ref="leftCol">
          <h2>Recherche de texte <small>(bouton « Rechercher »)</small></h2>
          <h3>Fonctionnement</h3>
          <p>La recherche de texte est une recherche en texte intégral : elle trouve les décisions dans lesquelles vos termes de recherche figurent littéralement – dans
             l'orthographe et dans la langue dans lesquelles vous les saisissez. Les opérateurs suivants vous permettent de préciser la recherche.
          </p>
          <h3>Troncature</h3>
          <p>Si vous effectuez une recherche avec le terme <i>propriétaire</i>, par exemple, vous ne recevrez que les documents dans lesquels ce terme apparaît de cette manière. Les documents contenant <i>propriétaires</i> (pluriel) ne seront pas trouvés. Avec <i>propriétaire*</i>, cependant, tous les mots commençant par ce mot seront trouvés comme par exemple <i>propriétaires</i>. Vous pouvez également utiliser la troncature suivant le mot recherché, c'est-à-dire que <i>*propriétaire</i> trouvera également des termes tels que <i>copropriétaire</i>. Une troncature combinée gauche et droite est également possible : <i>*propriétaire*</i>. On y trouve aussi, par exemple, des <i>copropriétaires</i>. Les lettres peuvent également être remplacées par un caractère de remplacement. Ainsi, <i>?udex</i> trouve à la fois <i>judex</i> et <i>iudex</i>.</p>

          <h3>Recherche approximative</h3>
          <p>Les termes peuvent également être recherchés dans des orthographes similaires. À cette fin, il convient d'utiliser un tilde (<i>~</i>). Une <a href="https://fr.wikipedia.org/wiki/Distance_de_Levenshtein">distance de Levenshtein</a> de 2 est utilisée. Ainsi <i>avocat~</i> trouve aussi <i>avvocati</i> et <i>Advokat</i>. Des écarts plus ou moins grands peuvent être trouvées avec <i>avocat~1</i> ou <i>avocat~3</i>. La recherche floue ne peut pas être combinée avec la troncature dans un terme de recherche.</p>

          <h3>Liaison logique</h3>
          <p>Si vous effectuez une recherche avec deux termes de recherche, ils sont automatiquement liés par <i>AND</i>. Cela signifie que les deux termes doivent être inclus dans la recherche en même temps. Si vous voulez trouver des documents qui contiennent au moins un des termes recherchés, utilisez l'opération <i>OR</i>. Il est important d'utiliser des majuscules pour les opérateurs de liaison, sinon ils seront recherchés comme des termes de recherche normaux. Vous pouvez également combiner les opérateurs <i>AND</i> et <i>OR</i>. Par exemple, <i>(meurtre OR homicide) AND alcool</i> permet de trouver tous les documents qui contiennent un <i>meurtre</i> ou un <i>homicide</i> ainsi que de l'<i>alcool</i>. Toutefois, les parenthèses sont <b>OBLIGATOIRES</b> dans ce cas. Sans parenthèses, le terme <i>meurtre</i> serait ignoré.</p>
          <p>Vous pouvez également rechercher tous les documents qui ne contiennent pas un terme. Ainsi, <i>NOT meurtre</i> trouvera tous les documents qui ne contiennent pas le terme <i>meurtre</i>.</p>

          <h3>Recherche de phrases</h3>
          <p>Vous pouvez utiliser des guillemets pour rechercher une expression fixe. Avec le <i>"droit des obligations"</i>, vous trouverez les mots exactement dans cet ordre. Ceci est également recommandé pour les recherches portant sur les numéros de dossier : <i>"4C.296/2003"</i>.</p>

          <h3>Recherche de distance</h3>
          <p>Si vous cherchez des termes qui apparaissent dans le même contexte, vous pouvez les trouver avec la recherche par distance : <i>"Expropriation valeur marchande"~5</i> trouve les deux termes à une distance maximale de 5 mots.</p>
        </div>
        <div class="help-col-right" ref="rightCol">
          <h2>Recherche IA <small>(bouton « Rechercher IA »)</small></h2>
          <h3>Fonctionnement</h3>
          <p>La recherche IA ne cherche pas des mots, mais du sens. Elle repose sur des « embeddings » (plongements) : un modèle de langage convertit chaque passage des
             décisions en un vecteur numérique qui en représente le contenu. Votre requête est convertie de la même manière ; sont trouvés les passages dont les vecteurs
             sont les plus proches de celui de votre requête. La recherche IA trouve donc aussi des décisions qui décrivent un état de fait avec d'autres mots.
          </p>
          <h3>Recherche multilingue</h3>
          <p>Les embeddings représentent le sens indépendamment de la langue. Une requête formulée en français trouve donc aussi des décisions rédigées en allemand ou en
             italien – et inversement. Vous n'avez donc pas besoin de traduire votre requête dans les autres langues nationales. Les décisions rédigées dans la langue de
             votre requête figurent toutefois souvent plus haut dans la liste des résultats.
          </p>
          <h3>Formuler la requête</h3>
          <p>La recherche IA fonctionne le mieux lorsque vous décrivez votre question en une ou plusieurs phrases, au lieu de saisir uniquement des mots-clés. Au lieu de
             <i>responsabilité verglas</i>, écrivez par exemple <i>Un piéton glisse en hiver sur le trottoir verglacé devant un magasin et se blesse. Qui est
             responsable ?</i> Vous trouverez ainsi des décisions sur la responsabilité du propriétaire d'ouvrage (art. 58 CO), bien que ce terme ne figure pas dans la
             requête – y compris des décisions rédigées en allemand et en italien.
          </p>
          <h3>Une liste de résultats, pas une réponse</h3>
          <p>Contrairement à un chatbot, la recherche IA ne formule pas de réponse à votre question. Vous obtenez toujours une liste de décisions que vous examinez et
             appréciez vous-même. La liste est classée selon la proximité de contenu avec votre requête ; aucun autre tri n'est disponible pour la recherche IA.
          </p>
          <p>Si vous souhaitez une réponse rédigée, vous pouvez faire utiliser entscheidsuche.ch par un assistant IA tel que ChatGPT ou Claude. L'interface MCP, disponible
             à l'adresse <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>, est prévue à cet effet. MCP (Model Context Protocol) est un standard
             ouvert qui permet aux applications d'IA d'accéder à des sources de données externes. L'interface MCP propose aussi bien la recherche de texte que la recherche
             IA. Lorsque entscheidsuche.ch est intégré de cette manière, l'assistant IA effectue lui-même la recherche, lit les décisions trouvées et formule sur cette base
             une réponse avec des renvois aux décisions.
          </p>
          <p>Dans ce cas, la réponse provient de l'assistant IA concerné et non d'entscheidsuche.ch. Vérifiez-la donc à l'aide des décisions citées.
          </p>
          <h3>Nombre de résultats</h3>
          <p>La recherche IA détermine les 100 passages qui correspondent le mieux à votre requête. Si plusieurs de ces passages se trouvent dans la même décision, celle-ci
             n'apparaît qu'une seule fois dans la liste des résultats. La liste contient donc en règle générale moins de 100 décisions.
          </p>
          <p>Si un filtre de métadonnées est déjà défini au lancement de la recherche IA, les 100 passages les plus pertinents ne sont déterminés qu'à l'intérieur de cette
             restriction. Si vous définissez ou modifiez un filtre après la recherche, il est d'abord appliqué aux résultats déjà trouvés ; la liste des résultats s'en
             trouve raccourcie. S'il reste alors trop peu de décisions, la recherche IA est automatiquement relancée avec le filtre, de sorte que vous obtenez à nouveau les
             meilleurs résultats à l'intérieur de la restriction choisie. Pendant ce temps, la mention « Nouvelle recherche avec filtre » s'affiche.
          </p>
        </div>
      </div>
      <h2>Métadonnées</h2>
      <p>Les deux modes de recherche peuvent être combinés avec des métadonnées. La date de la décision (si elle n'est pas disponible, la date de publication), le canton, le tribunal et, dans certains cas, la chambre sont disponibles en tant que métadonnées.</p>
      <p>Vous pouvez limiter la plage de dates à l'aide du curseur de date.</p>
      <p>La recherche peut être limitée aux tribunaux fédéraux ou aux différents cantons en cliquant sur ces liens. Vous pouvez alors étendre le canton et voir les tribunaux qui y sont disponibles et, dans certains cas, les chambres situées en dessous.</p>
      <p>Les métadonnées sont toujours liées aux termes de recherche actuels. Si vous souhaitez, dans la recherche de texte, effectuer une recherche uniquement sur les métadonnées, saisissez <i>*</i> comme terme de recherche.</p>

      <h2>Mises à jour</h2>
      <p>Sous la rubrique <b-link href="status">État des données</b-link>, vous trouverez un aperçu de nos sources avec la date de la dernière mise à jour dans chaque cas.</p>
    </template>
    <template v-if="locale==='it'">
      <h1>Aiuto alla ricerca</h1>
      <p>Su entscheidsuche.ch sono disponibili due modalità di ricerca: la ricerca testuale (pulsante «Ricercare») e la nuova ricerca IA (pulsante «Ricercare IA»).
         Entrambe possono essere completate con metadati. Nel campo di ricerca potete inserire qualsiasi termine. Non viene fatta distinzione tra maiuscole e minuscole.
      </p>
      <div class="help-columns">
        <div class="help-col-left" ref="leftCol">
          <h2>Ricerca testuale <small>(pulsante «Ricercare»)</small></h2>
          <h3>Funzionamento</h3>
          <p>La ricerca testuale è una ricerca a testo integrale: trova le decisioni in cui i termini di ricerca compaiono letteralmente – nella grafia e nella lingua in
             cui li inserite. Con gli operatori seguenti potete precisare la ricerca.
          </p>
          <h3>Troncamento</h3>
          <p>Se cercate ad esempio <i>proprietario</i>, ottenete soltanto i documenti in cui il termine compare in questa forma. I documenti che contengono
             <i>proprietaria</i> o <i>proprietari</i> non vengono trovati. Con <i>proprietari*</i> vengono invece trovate tutte le parole che iniziano così. Potete anche
             troncare a sinistra: <i>*proprietario</i> trova anche termini come <i>comproprietario</i>. È possibile anche un troncamento combinato a sinistra e a destra:
             <i>*proprietari*</i> trova ad esempio anche <i>comproprietaria</i>. Singole lettere possono inoltre essere sostituite da un carattere jolly: <i>?udex</i>
             trova sia <i>judex</i> sia <i>iudex</i>.
          </p>
          <h3>Ricerca fuzzy</h3>
          <p>I termini possono essere cercati anche con una grafia simile. A tal fine si aggiunge una tilde (<i>~</i>). Viene utilizzata una
             <a href="https://it.wikipedia.org/wiki/Distanza_di_Levenshtein">distanza di Levenshtein</a> pari a 2. Così <i>avvocato~</i> trova anche <i>avvocati</i> e
             <i>avocat</i>. Scostamenti minori o maggiori possono essere trovati con <i>avvocato~1</i> o <i>avvocato~3</i>. La ricerca fuzzy non può essere combinata con
             il troncamento nello stesso termine di ricerca.
          </p>
          <h3>Operatori logici</h3>
          <p>Se cercate con due termini, questi vengono collegati automaticamente con <i>AND</i>. Ciò significa che entrambi i termini devono essere presenti nel
             documento. Se desiderate trovare i documenti che contengono almeno uno dei termini, utilizzate l'operatore <i>OR</i>. Gli operatori devono essere scritti in
             maiuscolo, altrimenti vengono cercati come normali termini di ricerca. Potete anche combinare gli operatori <i>AND</i> e <i>OR</i>. Così
             <i>(omicidio OR assassinio) AND alcol</i> trova tutti i documenti che contengono <i>omicidio</i> o <i>assassinio</i> e anche <i>alcol</i>. In questo caso le
             parentesi sono <b>OBBLIGATORIE</b>. Senza parentesi il termine <i>omicidio</i> verrebbe ignorato.
          </p>
          <p>Potete anche cercare tutti i documenti che non contengono un termine. Così <i>NOT omicidio</i> trova tutti i documenti in cui il termine <i>omicidio</i> non
             compare.
          </p>
          <h3>Ricerca per frase</h3>
          <p>Con le virgolette potete cercare una sequenza fissa di parole. Con <i>"diritto delle obbligazioni"</i> trovate le parole esattamente in quest'ordine. Ciò è
             consigliato anche per la ricerca con numeri d'incarto: <i>"4C.296/2003"</i>.
          </p>
          <h3>Ricerca per distanza</h3>
          <p>Se cercate termini che compaiono nello stesso contesto, potete utilizzare la ricerca per distanza: <i>"espropriazione valore venale"~5</i> trova i due
             termini a una distanza massima di 5 parole.
          </p>
        </div>
        <div class="help-col-right" ref="rightCol">
          <h2>Ricerca IA <small>(pulsante «Ricercare IA»)</small></h2>
          <h3>Funzionamento</h3>
          <p>La ricerca IA non cerca parole, ma significati. Si basa sui cosiddetti embedding: un modello linguistico converte ogni passaggio delle decisioni in un vettore
             numerico che ne rappresenta il contenuto. La vostra richiesta viene convertita allo stesso modo; vengono trovati i passaggi i cui vettori sono più vicini a
             quello della richiesta. La ricerca IA trova quindi anche decisioni che descrivono una fattispecie con altre parole.
          </p>
          <h3>Ricerca multilingue</h3>
          <p>Gli embedding rappresentano il significato indipendentemente dalla lingua. Una richiesta formulata in italiano trova quindi anche decisioni redatte in tedesco
             o in francese – e viceversa. Non è dunque necessario tradurre la richiesta nelle altre lingue nazionali. Le decisioni redatte nella lingua della richiesta
             figurano tuttavia spesso più in alto nell'elenco dei risultati.
          </p>
          <h3>Formulare la richiesta</h3>
          <p>La ricerca IA funziona al meglio se descrivete la vostra questione in una o più frasi, invece di inserire soltanto parole chiave. Invece di
             <i>responsabilità ghiaccio</i> scrivete ad esempio <i>Un pedone scivola d'inverno sul marciapiede ghiacciato davanti a un negozio e si ferisce. Chi è
             responsabile?</i> Trovate così decisioni sulla responsabilità del proprietario di un'opera (art. 58 CO), benché questo termine non compaia nella richiesta –
             comprese decisioni redatte in tedesco e in francese.
          </p>
          <h3>Un elenco di risultati, non una risposta</h3>
          <p>A differenza di un chatbot, la ricerca IA non formula una risposta alla vostra domanda. Ottenete sempre un elenco di decisioni che esaminate e valutate voi
             stessi. L'elenco è ordinato secondo la vicinanza di contenuto alla richiesta; per la ricerca IA non è disponibile un altro ordinamento.
          </p>
          <p>Se desiderate una risposta formulata, potete far utilizzare entscheidsuche.ch da un assistente IA come ChatGPT o Claude. A tale scopo è disponibile
             l'interfaccia MCP all'indirizzo <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>. MCP (Model Context Protocol) è uno standard aperto
             che consente alle applicazioni di IA di accedere a fonti di dati esterne. L'interfaccia MCP offre sia la ricerca testuale sia la ricerca IA. Se
             entscheidsuche.ch è integrato in questo modo, l'assistente IA esegue esso stesso la ricerca, legge le decisioni trovate e formula su questa base una risposta
             con rinvii alle decisioni.
          </p>
          <p>In questo caso la risposta proviene dal rispettivo assistente IA e non da entscheidsuche.ch. Verificatela quindi sulla base delle decisioni citate.
          </p>
          <h3>Numero di risultati</h3>
          <p>La ricerca IA individua i 100 passaggi che corrispondono meglio alla vostra richiesta. Se più passaggi si trovano nella stessa decisione, questa compare una
             sola volta nell'elenco dei risultati. L'elenco contiene quindi di regola meno di 100 decisioni.
          </p>
          <p>Se all'avvio della ricerca IA è già impostato un filtro di metadati, i 100 passaggi più pertinenti vengono individuati soltanto all'interno di questa
             limitazione. Se impostate o modificate un filtro dopo la ricerca, esso viene dapprima applicato ai risultati già trovati; l'elenco dei risultati si accorcia
             di conseguenza. Se rimangono troppo poche decisioni, la ricerca IA viene rieseguita automaticamente con il filtro, in modo da ottenere nuovamente i migliori
             risultati all'interno della limitazione scelta. Nel frattempo compare l'indicazione «Nuova ricerca con filtro».
          </p>
        </div>
      </div>
      <h2>Metadati</h2>
      <p>Entrambe le modalità di ricerca possono essere combinate con metadati. Come metadati sono disponibili la data della decisione (se non è disponibile, viene
         utilizzata la data di pubblicazione), il Cantone, il tribunale e in parte anche la camera.</p>
      <p>Potete limitare l'intervallo di date con il cursore delle date.</p>
      <p>La ricerca può essere limitata ai tribunali federali o a singoli Cantoni cliccando sui rispettivi link. Potete espandere il Cantone per vedere i tribunali
         disponibili e, in parte, anche le camere.</p>
      <p>I metadati vengono sempre combinati con i termini di ricerca attuali. Se nella ricerca testuale desiderate cercare soltanto con i metadati, inserite <i>*</i>
         come termine di ricerca.</p>
      <h2>Aggiornamenti</h2>
      <p>Alla voce <b-link href="status">Stato dei dati</b-link> trovate una panoramica delle nostre fonti con la data dell'ultimo aggiornamento.</p>
    </template>
    <template v-if="locale==='en'">
      <h1>Search help</h1>
      <p>entscheidsuche.ch offers two kinds of search: the text search («Search» button) and the new AI search («AI search» button). Both can be
         combined with metadata. You can enter any search terms in the search field. Upper and lower case do not matter.
      </p>
      <div class="help-columns">
        <div class="help-col-left" ref="leftCol">
          <h2>Text search <small>(«Search» button)</small></h2>
          <h3>How it works</h3>
          <p>The text search is a full-text search: it finds decisions in which your search terms occur literally, in the spelling and in the language in which you
             enter them. The decisions are written in German, French or Italian, so enter your terms in one of these languages. You can refine the search with the following operators.
          </p>
          <h3>Truncation</h3>
          <p>If you search for <i>Eigentümer</i>, for example, you only get documents in which the term occurs in exactly this form. Documents containing <i>Eigentümerin</i> or
             <i>Eigentümers</i> are not found. <i>Eigentümer*</i>, however, finds all words that begin this way. You can also truncate on the left:
             <i>*Eigentümer</i> also finds terms such as <i>Grundeigentümer</i>. Left and right truncation can be combined:
             <i>*Eigentümer*</i> also finds <i>Grundeigentümerin</i>, for example. Single letters can be replaced by a placeholder as well: <i>?udex</i>
             finds both <i>judex</i> and <i>iudex</i>.
          </p>
          <h3>Fuzzy search</h3>
          <p>You can also search for terms in a similar spelling by appending a tilde (<i>~</i>). This uses a <a href="https://en.wikipedia.org/wiki/Levenshtein_distance">Levenshtein distance</a>
             of 2. <i>Eigentümer~</i> therefore also finds <i>Eigentümerin</i>. Smaller or larger deviations can be found with <i>Eigentümer~1</i> or <i>Eigentümer~3</i>.
             Within one search term, the fuzzy search cannot be combined with truncation.
          </p>
          <h3>Logical operators</h3>
          <p>If you search with two terms, they are automatically linked with <i>AND</i>: both terms must occur in the document.
             If you want to find documents that contain at least one of the terms, use <i>OR</i>. The operators must be written in
             capital letters; otherwise they are treated as ordinary search terms. You can also combine <i>AND</i> and <i>OR</i>.
             <i>(Mord OR Totschlag) AND Alkohol</i> finds all documents that contain <i>Mord</i> or <i>Totschlag</i> and also <i>Alkohol</i>. In this case brackets are <b>MANDATORY</b>.
             Without brackets, the search term <i>Mord</i> would be ignored.
          </p>
          <p>You can also search for all documents that do not contain a term. <i>NOT Mord</i> finds all documents in which the term <i>Mord</i> does not occur.
          </p>
          <h3>Phrase search</h3>
          <p>Use quotation marks to search for a fixed sequence of words. <i>"droit des obligations"</i> finds the words in exactly this order. This is also recommended
             when searching for case numbers: <i>"4C.296/2003"</i>.
          </p>
          <h3>Proximity search</h3>
          <p>To find terms that occur in the same context, use the proximity search: <i>"Enteignung Verkehrswert"~5</i> finds the two terms at a distance of at most
             5 words.
          </p>
        </div>
        <div class="help-col-right" ref="rightCol">
          <h2>AI search <small>(«AI search» button)</small></h2>
          <h3>How it works</h3>
          <p>The AI search does not look for words but for meaning. It is based on embeddings: a language model converts every passage of the decisions
             into a numerical vector that represents the content of the passage. Your query is converted in the same way; the search returns the passages whose
             vectors are closest to that of your query. The AI search therefore also finds decisions that describe a situation in different words.
          </p>
          <h3>Search across languages</h3>
          <p>The embeddings represent meaning independently of language. A query written in English therefore finds decisions written in German, French
             or Italian. You do not need to translate your query into the national languages.
             Decisions in the language of your query often rank higher in the list of hits, however.
          </p>
          <h3>Wording your query</h3>
          <p>The AI search works best when you describe your question in one or more sentences instead of entering keywords only. Instead of
             <i>liability black ice</i>, write for example <i>In winter, a pedestrian slips on the icy pavement in front of a shop and is injured.
             Who is liable?</i> This finds decisions on the liability of the owner of a structure (Art. 58 CO), although this term does not occur in the query,
             in German as well as in French and Italian.
          </p>
          <h3>A list of hits, not an answer</h3>
          <p>Unlike a chatbot, the AI search does not write an answer to your question. You still receive a list of decisions that you review and
             assess yourself. The list is ordered by how close the content is to your query; no other sort order is available for the AI search.
          </p>
          <p>If you would like a written answer, you can have entscheidsuche.ch used by an AI assistant such as ChatGPT or Claude. The
             MCP interface at <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a> is available for this purpose. MCP (Model Context Protocol) is an open
             standard through which AI applications access external data sources. The MCP interface offers both the text search and the AI search. When
             entscheidsuche.ch is connected in this way, the AI assistant runs the search itself, reads the decisions found and writes an answer on this basis,
             with references to the decisions.
          </p>
          <p>In this case the answer comes from the AI assistant, not from entscheidsuche.ch. You should therefore check it against the decisions cited.
          </p>
          <h3>Number of hits</h3>
          <p>The AI search determines the 100 passages that best match your query. If several of these passages belong to the same decision, the decision appears only
             once in the list of hits. The list therefore usually contains fewer than 100 decisions.
          </p>
          <p>If a metadata filter is already set when the AI search starts, the 100 best-matching passages are determined within this restriction only.
             If you set or change a filter after the search, it is first applied to the hits already found, which shortens the list.
             If too few decisions remain, the AI search is run again automatically with the filter, so that you again receive the best hits within the chosen
             restriction. Meanwhile the notice «Searching again with filter» is shown.
          </p>
        </div>
      </div>
      <h2>Metadata</h2>
      <p>Both kinds of search can be combined with metadata. The available metadata are the decision date (if it is missing, the publication date is used), the canton,
         the court and, in some cases, the chamber.</p>
      <p>You can restrict the date range with the date slider.</p>
      <p>The search can be restricted to the federal courts or to individual cantons by clicking on the corresponding links. You can expand a canton to see
         the courts available there and, in some cases, their chambers. The names of courts and chambers are shown in German.</p>
      <p>The metadata are always combined with the current search terms. If you want to search by metadata only in the text search, enter <i>*</i> as the search term.</p>
      <h2>Updates</h2>
      <p>Under <b-link href="status">Data status</b-link> you will find an overview of our sources with the date of the last synchronisation of each.</p>
    </template>
  </div>
</template>

<style lang="scss">
#organization {
  .help-col-left,
  .help-col-right {
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 20px;
  }

  // Two columns side by side on wide screens; the width of the left column is set by balanceColumns().
  @media (min-width: 992px) {
    .help-columns {
      display: flex;
      align-items: flex-start;
      gap: 30px;

      .help-col-left {
        flex: 0 0 50%;
        min-width: 0;
      }

      .help-col-right {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Organization'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }

  public mounted () {
    window.addEventListener('resize', this.balanceColumns)
    window.addEventListener('load', this.balanceColumns)
    this.$nextTick(this.balanceColumns)
  }

  public beforeDestroy () {
    window.removeEventListener('resize', this.balanceColumns)
    window.removeEventListener('load', this.balanceColumns)
  }

  @Watch('locale')
  public onLocaleChanged () {
    this.$nextTick(this.balanceColumns)
  }

  // Chooses the width of the left column so that both columns end at the same height.
  public balanceColumns () {
    const left = this.$refs.leftCol as HTMLElement | undefined
    const right = this.$refs.rightCol as HTMLElement | undefined
    if (left === undefined || right === undefined) return
    left.style.minHeight = ''
    right.style.minHeight = ''
    if (window.innerWidth < 992) {
      left.style.flex = ''
      return
    }
    let lo = 30
    let hi = 70
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2
      left.style.flex = `0 0 ${mid}%`
      if (left.offsetHeight > right.offsetHeight) {
        lo = mid
      } else {
        hi = mid
      }
    }
    left.style.flex = `0 0 ${(lo + hi) / 2}%`
    // Remaining difference of a few lines: let both grey boxes end at the same height.
    const height = Math.max(left.offsetHeight, right.offsetHeight)
    left.style.minHeight = `${height}px`
    right.style.minHeight = `${height}px`
  }
}
</script>
